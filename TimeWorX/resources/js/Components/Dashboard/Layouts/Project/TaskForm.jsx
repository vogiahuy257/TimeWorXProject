import React, { useState, useEffect } from "react";
import "./css/TaskForm.css";
import PrimaryButton from "@/Components/PrimaryButton";
import { toast } from "react-toastify";
import ConfirmationForm from "@/Components/ConfirmationForm";
const TaskForm = ({onClose, user_id,projectId, refreshTasks, task, task_status,project_deadline,is_staff }) => {
    const [taskName, setTaskName] = useState('');
    const [deadline, setDeadLine] = useState('');
    const [description, setDescription] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [isUserBoxVisible, setIsUserBoxVisible] = useState(false);
    const [deadLineError, setDeadLineError] =useState('');
    // giới hạn task tối đa
    const [confirmUser, setConfirmUser] = useState(null);
    const taskLimit = 4;
    
    // sự kiện xem user
    const [viewTaskToUser, setViewTaskToUser] = useState(null);

    const handleUserClick = async (user_id) =>   {

        try {
            const response = await axios.get(`/api/users/${user_id}/tasks`);
            setViewTaskToUser(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    const fetchUsers = async () => {
        try {
            if(projectId != null && projectId != "")
            {
                const response = await axios.get(`/api/project-view/${projectId}/users`); 
                setUsers(response.data); 
            }
            else
            {
                setUsers(null);
            }
        } catch (error) {
            toast.error('Error fetching users:', error);
        }
    };

    const onChangeDeadLine = (e) => {
        const selectedDate = e.target.value;
        setDeadLine(selectedDate);
    
        if (project_deadline && new Date(selectedDate) >= new Date(project_deadline)) {
            setDeadLineError(`Deadline cannot be greater than the project's end date: ${formatDeadline(project_deadline)}`);
        } 
        else 
        {
            setDeadLineError('');
        }
    };
    

    useEffect(() => {
        fetchUsers();
    }, []);

    const convertDateFormat = (dateStr) => {
        if (!dateStr) return '';
        const [day, month, year] = dateStr.split('-');
        return `${year}-${month}-${day}T00:00`;
    };
    

    const formatDeadline = (deadline) => {
        const date = new Date(deadline);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    
    

    useEffect(() => {
        if (task && projectId != null) 
        {
            setTaskName(task.content);
            setDescription(task.description || '');
            setDeadLine(convertDateFormat(task.deadline) || '');
            setSelectedUsers(task.users || []);
        }
        else if (task && user_id != null)
        {
            setTaskName(task.name);
            setDescription(task.description || "");
            setDeadLine(convertDateFormat(task.end_date) || '');
        } 
        else 
        {
            setTaskName('');
            setDescription('');
            setDeadLine('');
            setSelectedUsers([]);
        }
    }, [task]);
  
    const handleSubmit = async (event) => {
        event.preventDefault();
        let taskData = {};

        if (project_deadline && new Date(deadline) >= new Date(project_deadline)) {
            setDeadLineError(`Deadline cannot be greater than the project's end date: ${formatDeadline(project_deadline)}`);
            return;
        }
        if(projectId != null )
        {
            taskData = {
                task_name: taskName,
                deadline: deadline,
                description: description,
                status: task_status, 
                users: selectedUsers.map(user => user.id),
            };
        }
        else if(user_id)
        {
            taskData = {
                user_id: user_id,
                plan_name: taskName,
                plan_description: description,
                start_date: new Date().toISOString().split('T')[0],
                end_date: deadline,
                plan_status: task_status,
                plan_priority: 'Medium',
            }
        }
        

        try 
        {
            if (task && projectId) 
            {
                await axios.put(`/api/project-view/${projectId}/tasks/${task.id}`, taskData);
                toast.success("Task saved successfully!");
            } 
            else if(projectId)
            {
                await axios.post(`/api/project-view/${projectId}/tasks`, taskData);
                toast.success("Task create successfully!");
            }
            
            else if(user_id != null && task)
            {
                await axios.put(`/api/personal-plans/${task.id}`, taskData);
                toast.success("Task saved successfully!");
            }
            else if(user_id != null)
            {
                await axios.post(`/api/personal-plans`, taskData);
                toast.success("Task create successfully!");
            }
            
            await refreshTasks(user_id);
            onClose();
        } 
        catch (error) 
        {
            toast.error("Error saving task:", error);
        }
    };

    const toggleUserBox = () => {
        setIsUserBoxVisible(!isUserBoxVisible);
    };

    const handleUserSelection = (user) => {
        // Kiểm tra nếu người dùng đã có trong danh sách selectedUsers
        if (selectedUsers.some((u) => u.id === user.id)) {
            // Nếu đã có, gỡ người dùng ra khỏi selectedUsers
            setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
        } else {
            // Nếu chưa có và số lượng task vượt quá giới hạn, hiển thị form xác nhận
            if (user.active_tasks_count > taskLimit) {
                setConfirmUser(user);
            } else{
                // Nếu không vượt quá giới hạn, thêm trực tiếp vào selectedUsers
                setSelectedUsers([...selectedUsers, user]);
            }
        }
    };

    const handleConfirm = (isConfirmed) => {
        if (isConfirmed && confirmUser) {
            setSelectedUsers([...selectedUsers, confirmUser]);
        }
        setConfirmUser(null); // Đóng form xác nhận
    };

    return (
        <section id="task-form">
            <div className="task-form-container relative">
    
                <form onSubmit={handleSubmit}>
                    <div className="task-form-header">
                        <div className="flex items-center gap-1 px-1 pt-1">
                            <svg width="30" height="29" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.4" d="M16.8357 1.91003H7.19569C5.07569 1.91003 3.33569 3.65003 3.33569 5.77003V19.86C3.33569 21.66 4.62569 22.42 6.20569 21.55L11.0857 18.84C11.6057 18.55 12.4457 18.55 12.9557 18.84L17.8357 21.55C19.4157 22.43 20.7057 21.67 20.7057 19.86V5.77003C20.6957 3.65003 18.9657 1.91003 16.8357 1.91003Z" fill="currentColor"/>
                                <path d="M11.1057 13.2499C10.9157 13.2499 10.7257 13.1799 10.5757 13.0299L9.07565 11.5299C8.78565 11.2399 8.78565 10.7599 9.07565 10.4699C9.36565 10.1799 9.84565 10.1799 10.1357 10.4699L11.1057 11.4399L14.5757 7.96994C14.8657 7.67994 15.3457 7.67994 15.6357 7.96994C15.9257 8.25994 15.9257 8.73994 15.6357 9.02994L11.6357 13.0299C11.4857 13.1799 11.2957 13.2499 11.1057 13.2499Z" fill="currentColor"/>
                            </svg>
                            <h2 className="font-medium text-xl">{is_staff ? `View ${task?.content}` :(projectId ? (user_id ? (task ? `Edit ${task.name}` : "Create Task") : (task ? `Edit ${task.content}` :  "Create Task")) : "Create Your Personal Plan") }</h2>
                        </div>
                            
                        <div className="mt-2 flex items-center gap-1 px-1">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.75 3.56V2C16.75 1.59 16.41 1.25 16 1.25C15.59 1.25 15.25 1.59 15.25 2V3.5H8.74998V2C8.74998 1.59 8.40998 1.25 7.99998 1.25C7.58998 1.25 7.24998 1.59 7.24998 2V3.56C4.54998 3.81 3.23999 5.42 3.03999 7.81C3.01999 8.1 3.25999 8.34 3.53999 8.34H20.46C20.75 8.34 20.99 8.09 20.96 7.81C20.76 5.42 19.45 3.81 16.75 3.56Z" fill="currentColor"/>
                                <path opacity="0.4" d="M21 10.84V12.58C21 13.19 20.46 13.66 19.86 13.56C19.58 13.52 19.29 13.49 19 13.49C15.97 13.49 13.5 15.96 13.5 18.99C13.5 19.45 13.68 20.09 13.87 20.67C14.09 21.32 13.61 21.99 12.92 21.99H8C4.5 21.99 3 19.99 3 16.99V10.83C3 10.28 3.45 9.82996 4 9.82996H20C20.55 9.83996 21 10.29 21 10.84Z" fill="currentColor"/>
                                <path d="M19 15C16.79 15 15 16.79 15 19C15 19.75 15.21 20.46 15.58 21.06C16.27 22.22 17.54 23 19 23C20.46 23 21.73 22.22 22.42 21.06C22.79 20.46 23 19.75 23 19C23 16.79 21.21 15 19 15ZM21.07 18.57L18.94 20.54C18.8 20.67 18.61 20.74 18.43 20.74C18.24 20.74 18.05 20.67 17.9 20.52L16.91 19.53C16.62 19.24 16.62 18.76 16.91 18.47C17.2 18.18 17.68 18.18 17.97 18.47L18.45 18.95L20.05 17.47C20.35 17.19 20.83 17.21 21.11 17.51C21.39 17.81 21.37 18.28 21.07 18.57Z" fill="currentColor"/>
                                <path d="M8.5 15C8.24 15 7.98 14.89 7.79 14.71C7.61 14.52 7.5 14.26 7.5 14C7.5 13.74 7.61 13.48 7.79 13.29C8.02 13.06 8.37 12.95 8.7 13.02C8.76 13.03 8.82 13.05 8.88 13.08C8.94 13.1 9 13.13 9.06 13.17C9.11 13.21 9.16 13.25 9.21 13.29C9.39 13.48 9.5 13.74 9.5 14C9.5 14.26 9.39 14.52 9.21 14.71C9.16 14.75 9.11 14.79 9.06 14.83C9 14.87 8.94 14.9 8.88 14.92C8.82 14.95 8.76 14.97 8.7 14.98C8.63 14.99 8.56 15 8.5 15Z" fill="currentColor"/>
                                <path d="M12 14.9999C11.74 14.9999 11.48 14.8899 11.29 14.7099C11.11 14.5199 11 14.2599 11 13.9999C11 13.7399 11.11 13.48 11.29 13.29C11.67 12.92 12.34 12.92 12.71 13.29C12.89 13.48 13 13.7399 13 13.9999C13 14.2599 12.89 14.5199 12.71 14.7099C12.52 14.8899 12.26 14.9999 12 14.9999Z" fill="currentColor"/>
                                <path d="M8.5 18.5C8.24 18.5 7.98 18.39 7.79 18.21C7.61 18.02 7.5 17.76 7.5 17.5C7.5 17.24 7.61 16.98 7.79 16.79C7.89 16.7 7.99 16.63 8.12 16.58C8.49 16.42 8.93 16.51 9.21 16.79C9.39 16.98 9.5 17.24 9.5 17.5C9.5 17.76 9.39 18.02 9.21 18.21C9.02 18.39 8.76 18.5 8.5 18.5Z" fill="currentColor"/>
                            </svg>

                            <p className="font-normal"> {project_deadline ? `Completion Date: ${formatDeadline(project_deadline)}` : null}</p>
                        </div>
                            
                        <div className="form-main px-1">
                        <div className="form-group task-group">
                                <label htmlFor="task-name">{projectId ? "Task name:" : "Personal Plan name:"}</label>
                                <input
                                    type="text"
                                    id="task-name"
                                    value={is_staff ? task?.content : taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                    disabled={is_staff}
                                    required
                                />
                        </div>

                        <div className="form-group time-group">
                                <label htmlFor="time-starts">Completion time:</label>
                                <input
                                    type="datetime-local"
                                    id="time-starts"
                                    value={is_staff ? convertDateFormat(task?.deadline) : deadline}
                                    onChange={onChangeDeadLine}
                                    min={new Date().toISOString().slice(0, 16)}
                                    disabled={is_staff}
                                    required
                                />
                                {deadLineError && <p className="text-error">{deadLineError}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">{projectId ? "Description:" : "Personal Plan Description:"}</label>
                            <textarea
                                id="description"
                                value={description}
                                className="custom-scrollbar"
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={is_staff}
                            ></textarea>
                        </div>
                        </div>

                        {projectId && (
                            <div className="user-list flex flex-col justify-center items-center p-4 rounded-md custom-scrollbar">
                                {selectedUsers.map((selectedUser) => (
                                    <div className="user-item" key={selectedUser.id}>
                                        <div className="user-info">
                                            <span className="user-icon">
                                                <img src="/image/y.jpg" alt="" />
                                            </span>
                                            <span className="username">
                                                {selectedUser.name}
                                            </span>
                                        </div>
                                        <PrimaryButton className="chat-button">
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M3 10.4C3 8.15979 3 7.03969 3.43597 6.18404C3.81947 5.43139 4.43139 4.81947 5.18404 4.43597C6.03969 4 7.15979 4 9.4 4H14.6C16.8402 4 17.9603 4 18.816 4.43597C19.5686 4.81947 20.1805 5.43139 20.564 6.18404C21 7.03969 21 8.15979 21 10.4V11.6C21 13.8402 21 14.9603 20.564 15.816C20.1805 16.5686 19.5686 17.1805 18.816 17.564C17.9603 18 16.8402 18 14.6 18H7.41421C7.149 18 6.89464 18.1054 6.70711 18.2929L4.70711 20.2929C4.07714 20.9229 3 20.4767 3 19.5858V18V13V10.4ZM9 8C8.44772 8 8 8.44772 8 9C8 9.55228 8.44772 10 9 10H15C15.5523 10 16 9.55228 16 9C16 8.44772 15.5523 8 15 8H9ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H12C12.5523 14 13 13.5523 13 13C13 12.4477 12.5523 12 12 12H9Z"
                                                    fill="#222222"
                                                />
                                            </svg>
                                        </PrimaryButton>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>    

                    <div className="task-form-button h-full">
                        <PrimaryButton className="close-button" type="button" onClick={onClose}>
                            <svg width="24" height="24" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.5 7.5L7.5 22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M7.5 7.5L22.5 22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </PrimaryButton>
                        {projectId &&(
                            <div className="h-2/5 user-box shadow-md rounded-lg p-4 max-h-80">
                                <h3 className="text-lg font-semibold ">Users List</h3>
                                <ul className="overflow-y-auto max-h-60 scrollbar-hide p-2">
                                    {users.map((user) => (
                                        <li 
                                            key={user.id} 
                                            className="flex justify-between items-center p-3 shadow-md"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Ngăn chặn sự kiện lan truyền lên form
                                                handleUserClick(user.id); // Gọi hàm xử lý khi bấm vào user
                                            }}
                                        >
                                            <div>
                                                <div className="flex items-center gap-1">
                                                    <svg width="16" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                                                        <path d="M11.9999 14.5C6.98991 14.5 2.90991 17.86 2.90991 22C2.90991 22.28 3.12991 22.5 3.40991 22.5H20.5899C20.8699 22.5 21.0899 22.28 21.0899 22C21.0899 17.86 17.0099 14.5 11.9999 14.5Z" fill="currentColor"/>
                                                    </svg>
                                                    <p className="text-sm font-medium">{user.name}</p>
                                                </div>
                                                <div className="mt-1 flex items-center gap-1">
                                                <svg width="16" height="14" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M14.85 2H10.15C9.11001 2 8.26001 2.84 8.26001 3.88V4.82C8.26001 5.86 9.10001 6.7 10.14 6.7H14.85C15.89 6.7 16.73 5.86 16.73 4.82V3.88C16.74 2.84 15.89 2 14.85 2Z" fill="currentColor"/>
                                                    <path d="M17.74 4.81998C17.74 6.40998 16.44 7.70998 14.85 7.70998H10.15C8.56004 7.70998 7.26004 6.40998 7.26004 4.81998C7.26004 4.25998 6.66004 3.90998 6.16004 4.16998C4.75004 4.91998 3.79004 6.40998 3.79004 8.11998V17.53C3.79004 19.99 5.80004 22 8.26004 22H16.74C19.2 22 21.21 19.99 21.21 17.53V8.11998C21.21 6.40998 20.25 4.91998 18.84 4.16998C18.34 3.90998 17.74 4.25998 17.74 4.81998ZM12.88 16.95H8.50004C8.09004 16.95 7.75004 16.61 7.75004 16.2C7.75004 15.79 8.09004 15.45 8.50004 15.45H12.88C13.29 15.45 13.63 15.79 13.63 16.2C13.63 16.61 13.29 16.95 12.88 16.95ZM15.5 12.95H8.50004C8.09004 12.95 7.75004 12.61 7.75004 12.2C7.75004 11.79 8.09004 11.45 8.50004 11.45H15.5C15.91 11.45 16.25 11.79 16.25 12.2C16.25 12.61 15.91 12.95 15.5 12.95Z" fill="currentColor"/>
                                                </svg>
                                                <p className="active-task-count text-xs font-light"><strong>Active Tasks:</strong> {user.active_tasks_count}</p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                value={user.id}
                                                checked={selectedUsers.some(selectedUser => selectedUser.id === user.id)}
                                                onChange={() => handleUserSelection(user)}
                                                disabled={is_staff}
                                                className="ml-4 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>)
                        }

                    {viewTaskToUser && (
                        <div className="h-3/5 task-box shadow-md rounded-lg p-4 my-3 relative flex justify-center items-center">
                            <h3 className=" absolute shadow-gray-200 shadow-md bg-black rounded-bl-md rounded-br-md text-white px-2 py-1 top-0 left-1/2 -translate-x-1/2 text-sm whitespace-nowrap">Tasks for {viewTaskToUser.name}</h3>
                            <div className="w-full mt-4 max-h-52 overflow-y-auto scrollbar-hide">
                                {Object.keys(viewTaskToUser.tasks).length > 0 ? (
                                    Object.keys(viewTaskToUser.tasks).map((projectName, index) => (
                                        <div key={index} className=" rounded-lg m-2 shadow-md overflow-hidden">
                                            <h4 className="flex items-center text-sm font-semibold p-4 truncate max-w-full overflow-hidden whitespace-nowrap">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor" className="mr-2">
                                                    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h207q16 0 30.5 6t25.5 17l57 57h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/>
                                                </svg>
                                                {projectName}
                                            </h4>
                                            <ul className="">
                                                {viewTaskToUser.tasks[projectName].length > 0 ? (
                                                    viewTaskToUser.tasks[projectName].map((task, taskIndex) => (
                                                        <li key={taskIndex} className="py-2 px-4 text-xs rounded-md truncate max-w-full overflow-hidden whitespace-nowrap">
                                                            {task.task_name}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <p className="p-4 text-center text-gray-500">No tasks for this project</p>
                                                )}
                                            </ul>
                                        </div>

                                    ))
                                ) : (
                                    <p className="p-4 text-center text-gray-500">This user has no tasks yet</p>
                                )}
                            </div>
                        </div> 
                    )}

                        

                        {is_staff ? null :
                            <button type="submit" className="save-button mt-auto">
                                <h2>{task ? `Save` : "Create"}</h2>
                            </button>
                        } 
                        
                    </div>
                </form>
                {confirmUser && (
                <ConfirmationForm
                    type={'help'}
                    styleToBox = {"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"}
                    styleToChildren={``}
                    children={`This ${confirmUser.name} already has too many tasks assigned. Are you sure you want to add them to the project?`}
                    handleConfirm={handleConfirm}
                />
                )}
            </div>
        </section>
    );
};

export default TaskForm;
