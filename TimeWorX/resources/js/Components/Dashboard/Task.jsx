import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrimaryButton from '@/Components/PrimaryButton';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskForm from './Layouts/Project/TaskForm';
import DeletedTasks from './Layouts/Project/DeletedTasks';
import TaskComments from './Layouts/Project/TaskComments';
import ReportForm from './Layouts/Task/ReportForm';

export default function Task({ auth }) {
    const [ project_id,setProjectId ] = useState();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [projects, setProjects] = useState([]); 
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskStatus, setTaskStatus] = useState(null);
    const [totalTaskCount,setTotalTaskCount] = useState(0);
    const [showDeletedTasks, setShowDeletedTasks] = useState(false);
    const [showComments,setShowComments] = useState(false);
    const [showReportForm, setShowReportForm] = useState(false);

    const handleReportClick = (task) => {
        setShowReportForm(!showReportForm);
        setSelectedTask(task);
      };

    const toggleDeletedTasks = () => {
        setShowDeletedTasks(!showDeletedTasks);
    };

    const toggleComment = () => {
        setShowComments(!showComments);
    };

    const handleCommentClick = (task) => 
    {
            setSelectedTask(task);
            toggleComment();
    };
    

    const handleAddTask = (status) => {
        setSelectedTask(null);
        setTaskStatus(status);
        toggleForm(); 
    };

    const handleViewClick = (task) => {
        setSelectedTask(task);
        setTaskStatus(task.status);
        toggleForm();
    };

    const handleDeleteTask = async (task) => {
        try {
            await axios.delete(`/api/personal-plans/${task.id}`);
            toast.success("Task has been completed !");
            await fetchProjectData(auth.user.id);
        } catch (error) {
            toast.error("Error updating task status: " + error.message);
        }
    };
    
    const toggleForm = () => {
        setIsFormOpen(!isFormOpen);
    };

    const [tasks, setTasks] = useState({
        'to-do': [],
        'in-progress': [],
        'done': [],
    });

    const updateTaskStatus = async (id, newStatus, isPersonalPlan = false) => {
        try {
            const endpoint = isPersonalPlan ? `/api/personal-plans/${id}/status` : `/api/tasks/${id}`;
            const data = isPersonalPlan ? { plan_status: newStatus } : { status: newStatus };
            await axios.put(endpoint, data);
        } catch (error) {
            toast.error("Error updating task status: " + error.message);
        }
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;
        const sourceColumn = source.droppableId;
        const destinationColumn = destination.droppableId;
        const sourceTasks = Array.from(tasks[sourceColumn]);
        const [movedTask] = sourceTasks.splice(source.index, 1);
        if (sourceColumn === destinationColumn) {
            sourceTasks.splice(destination.index, 0, movedTask);
            setTasks((prevState) => ({
                ...prevState,
                [sourceColumn]: sourceTasks,
            }));
        } else {
            const destinationTasks = Array.from(tasks[destinationColumn]);
            destinationTasks.splice(destination.index, 0, movedTask);
            setTasks((prevState) => ({
                ...prevState,
                [sourceColumn]: sourceTasks,
                [destinationColumn]: destinationTasks,
            }));
            const isPersonalPlan = movedTask.type === 'personalPlan'; 
            // Nếu là task và trạng thái là 'done', chuyển thành 'verify'
        if (movedTask.type === 'task' && destinationColumn === 'done') {
            updateTaskStatus(movedTask.id, 'verify', isPersonalPlan);
        } else {
            updateTaskStatus(movedTask.id, destinationColumn, isPersonalPlan);
        }
        }
    };

    const fetchProjectData = async (user_id,project_id) => {
        try {
            const response = await axios.get(`/api/tasks/${user_id}`, { params: { project_id } });
            const projectData = response.data;
            setProjects(response.data.projects);
            // Cập nhật các kế hoạch cá nhân với thuộc tính 'type'
            const updatedPersonalPlans = {
                'to-do': projectData.personalPlans['to-do']?.map(task => ({ ...task, type: 'personalPlan' })) || [],
                'in-progress': projectData.personalPlans['in-progress']?.map(task => ({ ...task, type: 'personalPlan' })) || [],
                'done': [
                ...(projectData.personalPlans['verify']?.map(task => ({ ...task, type: 'personalPlan' })) || []),
                ...(projectData.personalPlans['done']?.map(task => ({ ...task, type: 'personalPlan' })) || [])
                ],
            };

            // Cập nhật các tác vụ với thuộc tính 'type'
            const updatedTasks = {
                'to-do': projectData.tasks['to-do']?.map(task => ({ ...task, type: 'task' })) || [],
                'in-progress': projectData.tasks['in-progress']?.map(task => ({ ...task, type: 'task' })) || [],
                'done': [
                ...(projectData.tasks['verify']?.map(task => ({ ...task, type: 'task' })) || [])
                ],
                // đã đổi done thành verify vì nhân viên sẽ không nhìn thầy cột done
            };

            const mergedTasks = {
                'to-do': [...updatedTasks['to-do'], ...updatedPersonalPlans['to-do']],
                'in-progress': [...updatedTasks['in-progress'], ...updatedPersonalPlans['in-progress']],
                'done': [...updatedTasks['done'], ...updatedPersonalPlans['done']],
            };

            // Thiết lập trạng thái
            setTasks(mergedTasks);
            const totalTaskCount = Object.values(mergedTasks).flat().length;
            setTotalTaskCount(totalTaskCount);
        } catch (error) {
            toast.error('Error fetching project details or tasks');
        }
    };

    useEffect(() => {
        fetchProjectData(auth.user.id,project_id);
    }, [project_id]);
    return (
        <>
            <Head title="Task" />
            <ToastContainer className="custom_toast"/>
        <section id='project-view'>

            {/* Menu */}
            <div className="block-project">
                <div className='block-element-left'>
                    <div className='block-project-name'>
                        <h1>Task</h1>
                    </div>
                    

                    {/* Bộ lọc */}
                    <div className="ml-4 filter-section flex items-center justify-center">
                        {/* Bộ lọc theo trạng thái */}
                        <select 
                            className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black-400 appearance-none bg-white text-gray-700 transition duration-150 ease-in-out"
                            onChange={(e)=>setProjectId(e.target.value)}
                        >
                            <option value="">All</option>
                                {projects.map(project => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            <option value="personalPlan">Your Pesonal Plan</option>
                        </select>
                    </div>

                </div>
                <div className='block-element-right'>
                    <PrimaryButton onClick={toggleDeletedTasks} className='btn btn-history'>
                        <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 13.1429V17.7143C3 18.9767 4.00736 20 5.25 20H18.75C19.9926 20 21 18.9767 21 17.7143V13.1429M3 13.1429L5.82751 5.48315C6.15683 4.59102 6.99635 4 7.93425 4H16.0657C17.0037 4 17.8432 4.59102 18.1725 5.48315L21 13.1429M3 13.1429H7.5L9 14.7429H15L16.5 13.1429H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </PrimaryButton>
                </div>
            </div>

            {/* Main Project View */}
            <main className="task-board">
                <DragDropContext onDragEnd={onDragEnd}>
                    {Object.keys(tasks).map((columnId) => (
                        <Droppable droppableId={columnId} key={columnId}>
                            {(provided) => (
                                <div
                                    className={`block-task ${columnId}`}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <div className='block-task-header'>
                                    <h1>{columnId}</h1>
                                    {/* Button to add new task */}
                                    <PrimaryButton className='task-add-card' onClick={() => handleAddTask(columnId)}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 6L12 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                <path d="M18 12L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                            <p>Add card</p>
                                        </PrimaryButton>
                                        </div>
                                    <div className="block-task-list">
                                            {tasks[columnId].map((task, index) => (
                                                <Draggable key={`${task.type}-${task.id}`} draggableId={`${task.type}-${task.id}`} index={index}>
                                                    {(provided) => (
                                                        <div 
                                                            className={`task-card ${ columnId === 'done' ? null : task.is_late ? "is_late" : task.is_near_deadline ? "is_near_deadline" : ""}`}
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <div className='task-card-content'>
                                                                <p className='project-name'>{task.type == 'personalPlan' ? null : task.project_name}</p>
                                                                <p>{task.type == 'personalPlan' ? task.name :task.content}</p>
                                                                <div className='btn-group'>
                                                                {task.type === 'personalPlan' ? 
                                                                (
                                                                    <>
                                                                        <PrimaryButton className='btn-view' onClick={() => handleViewClick(task)}>
                                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                                                                                <path d="M20.188 10.9343C20.5762 11.4056 20.7703 11.6412 20.7703 12C20.7703 12.3588 20.5762 12.5944 20.188 13.0657C18.7679 14.7899 15.6357 18 12 18C8.36427 18 5.23206 14.7899 3.81197 13.0657C3.42381 12.5944 3.22973 12.3588 3.22973 12C3.22973 11.6412 3.42381 11.4056 3.81197 10.9343C5.23206 9.21014 8.36427 6 12 6C15.6357 6 18.7679 9.21014 20.188 10.9343Z" stroke="currentColor" strokeWidth="2"/>
                                                                            </svg>
                                                                        </PrimaryButton>
                                                                        {columnId === 'done' && (
                                                                            <PrimaryButton className='ml-1 btn-delete' onClick={() => handleDeleteTask(task)}>
                                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M7 11.8784C7.94144 12.5631 9.82432 14.4459 10.5946 15.7297C11.536 13.6757 13.9324 9.05405 16.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                                </svg>
                                                                            </PrimaryButton>
                                                                        )}
                                                                    </>
                                                                ) : 
                                                                (
                                                                    <>
                                                                        {columnId === 'done' && (
                                                                            <PrimaryButton className='btn-report mr-1' onClick={() => handleReportClick(task)}>
                                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M11.6998 21.6001H5.69979C4.37431 21.6001 3.2998 20.5256 3.2998 19.2001L3.2999 4.80013C3.29991 3.47466 4.37442 2.40015 5.6999 2.40015H16.5002C17.8256 2.40015 18.9002 3.47466 18.9002 4.80015V9.60015M7.50018 7.20015H14.7002M7.50018 10.8001H14.7002M14.7002 15.5541V18.4985C14.7002 19.9534 16.2516 21.2879 17.7065 21.2879C19.1615 21.2879 20.7002 19.9535 20.7002 18.4985V14.7793C20.7002 14.009 20.2574 13.2273 19.2723 13.2273C18.2186 13.2273 17.7065 14.009 17.7065 14.7793V18.3435M7.50018 14.4001H11.1002" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                                                </svg>
                                                                            </PrimaryButton>
                                                                        )}
                                                                        <PrimaryButton className='btn-comment' onClick={() => handleCommentClick(task)}>
                                                                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M7.1999 7.20002H15.5999M7.1999 12H11.9999M11.6869 16.5913L6.67816 21.6V16.5913H4.7999C3.47442 16.5913 2.3999 15.5168 2.3999 14.1913V4.80003C2.3999 3.47454 3.47442 2.40002 4.7999 2.40002H19.1999C20.5254 2.40002 21.5999 3.47454 21.5999 4.80002V14.1913C21.5999 15.5168 20.5254 16.5913 19.1999 16.5913H11.6869Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                            </svg>
                                                                        </PrimaryButton>
                                                                    </>
                                                                )}
                                                                </div>
                                                            </div>
                                                            <div className={task.type == 'personalPlan' ? 'task-card-element pesonal-plan' : 'task-card-element'}>
                                                                {/* number user to task */}
                                                                {
                                                                    task.type == 'personalPlan' ? null :
                                                                    (
                                                                        <div className='task-element element-left'>
                                                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M11.4635 11.3199C11.7859 11.2527 11.978 10.9152 11.8178 10.6274C11.4645 9.99297 10.908 9.43544 10.1961 9.01056C9.27918 8.46335 8.15577 8.16675 7.00007 8.16675C5.84436 8.16675 4.72095 8.46335 3.80407 9.01055C3.09215 9.43543 2.53563 9.99296 2.18238 10.6274C2.02214 10.9152 2.21419 11.2527 2.53667 11.3199C5.48064 11.9334 8.51949 11.9334 11.4635 11.3199Z" fill="currentColor"/>
                                                                                <circle cx="6.99992" cy="4.66667" r="2.91667" fill="currentColor"/>
                                                                            </svg>
                                                                            <span className='user-number'>{task.user_count}</span>
                                                                        </div>
                                                                    )
                                                                }
                                                                
                                                                <div className='task-element element-right'>
                                                                    <p>deadline:</p>
                                                                    <p>{task.type == 'personalPlan' ? task.end_date : task.deadline || 'N/A'}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </DragDropContext>
            </main>

            {/* Hiển thị History */}
            {showDeletedTasks && <DeletedTasks resetPage={fetchProjectData} user_id={auth.user.id} projectId={null} />}

            {showComments && (
                <TaskComments 
                    taskId={selectedTask.id} 
                    onClose={() => setShowComments(false)} 
                    isManagerComment ={false}
                />
            )}

             
                {/* hiển thị ReportForm */}
             {showReportForm && <ReportForm task={selectedTask} user_id={auth.user.id} onClose={() => setShowReportForm(false)}/>}
                {/* Hiển thị TaskForm */}
             {isFormOpen && <TaskForm onClose={toggleForm} user_id={auth.user.id} projectId={null} refreshTasks={fetchProjectData} task={selectedTask} task_status={taskStatus}/>}
        </section>
        </>
    );
}
