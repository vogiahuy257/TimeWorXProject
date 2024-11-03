import React, { useState, useEffect } from "react";
import "./css/TaskForm.css";
import PrimaryButton from "@/Components/PrimaryButton";
import { toast } from "react-toastify";;
const TaskForm = ({onClose, user_id,projectId, refreshTasks, task, task_status,project_deadline,is_staff }) => {
    const [taskName, setTaskName] = useState('');
    const [deadline, setDeadLine] = useState('');
    const [description, setDescription] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [isUserBoxVisible, setIsUserBoxVisible] = useState(false);
    const [deadLineError, setDeadLineError] =useState('');
    


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
    
        if (project_deadline && new Date(selectedDate) < new Date(project_deadline)) {
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

        if (project_deadline && new Date(deadline) < new Date(project_deadline)) {
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
        if (selectedUsers.some((u) => u.id === user.id)) {
            setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    return (
        <section id="task-form">
            <div className="task-form-container">
    
                <form onSubmit={handleSubmit}>
                    <div className="task-form-header">
                            <h2>{is_staff ? `View ${task?.content}` :(projectId ? (user_id ? (task ? `Edit ${task.name}` : "Create Task") : (task ? `Edit ${task.content}` :  "Create Task")) : "Create Your Personal Plan") }</h2>
                            <p> {project_deadline ? `Project end date: ${formatDeadline(project_deadline)}` : null}</p>
                        <div className="form-main">
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
                            <div className="user-list custom-scrollbar">
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

                    <div className="task-form-button">
                    <PrimaryButton className="close-button" type="button" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.5 7.5L7.5 22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7.5 7.5L22.5 22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </PrimaryButton>
                    {projectId &&(
                        <div className="user-box bg-white shadow-md rounded-lg p-4 max-h-80">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Users List</h3>
                            <ul className="divide-y divide-gray-200 overflow-y-auto max-h-60 scrollbar-hide">
                                {users.map((user) => (
                                    <li key={user.id} className="flex justify-between items-center p-3 hover:bg-gray-100 transition duration-300 ease-in-out">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800"><strong>Name:</strong> {user.name}</p>
                                            <p className="text-xs text-gray-600"><strong>Active tasks count:</strong> {user.active_tasks_count}</p>
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
                    {is_staff ? null :
                        <button type="submit" className="save-button mt-auto">
                            <h2>{task ? `Save` : "Create"}</h2>
                        </button>
                    } 
                    
                    </div>
                    
                </form>

            </div>
        </section>
    );
};

export default TaskForm;
