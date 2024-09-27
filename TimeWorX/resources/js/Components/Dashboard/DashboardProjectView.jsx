import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrimaryButton from '@/Components/PrimaryButton';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskForm from './Layouts/Project/TaskForm';

const DashboardProjectView = ({ auth }) => {
    const navigate = useNavigate();
    const { project_id } = useParams();
    const [project, setProject] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false); 

    const toggleForm = () => {
        setIsFormOpen(!isFormOpen);
    };

    const [tasks, setTasks] = useState({
        'to-do': [],
        'in-progress': [],
        'verify': [],
        'done': [],
    });

    const handleBackClick = () => {
        navigate('/dashboard/project');
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            await axios.put(`/api/project-view/${taskId}`, {
                status: newStatus
            });
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
            updateTaskStatus(movedTask.id, destinationColumn);
        }
    };

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const response = await axios.get(`/api/project-view/${project_id}`);
                const projectData = response.data;
                setProject(projectData.project);
                setTasks({
                    'to-do': projectData.tasks['to-do'] || [],
                    'in-progress': projectData.tasks['in-progress'] || [],
                    'verify': projectData.tasks['verify'] || [],
                    'done': projectData.tasks['done'] || [],
                });
            } catch (error) {
                toast.error('Error fetching project details or tasks');
            }
        };

        fetchProjectData();
    }, [project_id]);

    if (!project) {
        return <p>Loading project details...</p>;
    }

    return (
        <section id='project-view'>
            <Head title={`${project.name}`} />
            <ToastContainer className="custom_toast"/>

            {/* Menu */}
            <div className="block-project">
                <div className='block-element-left'>
                    <PrimaryButton className='btn-black' onClick={handleBackClick}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 12L3.29289 11.2929L2.58579 12L3.29289 12.7071L4 12ZM19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11V13ZM9.29289 5.29289L3.29289 11.2929L4.70711 12.7071L10.7071 6.70711L9.29289 5.29289ZM3.29289 12.7071L9.29289 18.7071L10.7071 17.2929L4.70711 11.2929L3.29289 12.7071ZM4 13H19V11H4V13Z" fill="currentColor"/>
                        </svg>
                    </PrimaryButton>
                    <div className='block-project-name'>
                        <h1>{project.name}</h1>
                    </div>
                </div>
                <div className='block-element-right'>
                    <PrimaryButton className='btn btn-person'>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="9" r="4" fill="currentColor"/>
                            <circle cx="17" cy="9" r="3" fill="currentColor"/>
                            <circle cx="7" cy="9" r="3" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M17.5685 18H19.895C20.4867 18 20.9403 17.4901 20.7966 16.9162C20.4284 15.4458 19.448 13 17 13C16.114 13 15.4201 13.3205 14.8781 13.7991C16.3858 14.7773 17.1654 16.4902 17.5685 18Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M9.12197 13.7991C8.57989 13.3205 7.88609 13 7 13C4.55208 13 3.57166 15.4458 3.20343 16.9162C3.05971 17.4901 3.51335 18 4.10498 18H6.43155C6.83464 16.4902 7.61422 14.7773 9.12197 13.7991Z" fill="currentColor"/>
                            <path d="M12 14C15.7087 14 16.6665 17.301 16.9139 19.0061C16.9932 19.5526 16.5523 20 16 20H8C7.44772 20 7.00684 19.5526 7.08614 19.0061C7.33351 17.301 8.29134 14 12 14Z" fill="currentColor"/>
                        </svg>
                    </PrimaryButton>
                    <PrimaryButton className='btn btn-history'>
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
                                    <h1>{columnId}</h1>
                                    <div className="block-task-list">
                                        {/* Button to add new task */}
                                        <PrimaryButton className='task-add-card' onClick={toggleForm}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 6L12 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                <path d="M18 12L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                            <p>Add a card</p>
                                        </PrimaryButton>

                                        {tasks[columnId].map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                {(provided) => (
                                                    <div 
                                                        className="task-card"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <div className='task-card-content'>
                                                            <p>{task.content}</p>
                                                            <PrimaryButton className='btn-view'>
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                                                                <path d="M20.188 10.9343C20.5762 11.4056 20.7703 11.6412 20.7703 12C20.7703 12.3588 20.5762 12.5944 20.188 13.0657C18.7679 14.7899 15.6357 18 12 18C8.36427 18 5.23206 14.7899 3.81197 13.0657C3.42381 12.5944 3.22973 12.3588 3.22973 12C3.22973 11.6412 3.42381 11.4056 3.81197 10.9343C5.23206 9.21014 8.36427 6 12 6C15.6357 6 18.7679 9.21014 20.188 10.9343Z" stroke="currentColor" strokeWidth="2"/>
                                                            </svg>
                                                            </PrimaryButton>
                                                        </div>
                                                        <div className='task-card-element'>
                                                            <div className='task-element element-left'>
                                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M11.4635 11.3199C11.7859 11.2527 11.978 10.9152 11.8178 10.6274C11.4645 9.99297 10.908 9.43544 10.1961 9.01056C9.27918 8.46335 8.15577 8.16675 7.00007 8.16675C5.84436 8.16675 4.72095 8.46335 3.80407 9.01055C3.09215 9.43543 2.53563 9.99296 2.18238 10.6274C2.02214 10.9152 2.21419 11.2527 2.53667 11.3199C5.48064 11.9334 8.51949 11.9334 11.4635 11.3199Z" fill="currentColor"/>
                                                                <circle cx="6.99992" cy="4.66667" r="2.91667" fill="currentColor"/>
                                                            </svg>
                                                                <span className='user-number'>{task.user_count}</span>
                                                            </div>
                                                            <div className='task-element element-right'>
                                                                <p>deadline:</p>
                                                                <p>{task.deadline || 'N/A'}</p>
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

             {/* Hiển thị TaskForm */}
             {isFormOpen && (
                <TaskForm />
            )}
        </section>
    );
};

export default DashboardProjectView;
