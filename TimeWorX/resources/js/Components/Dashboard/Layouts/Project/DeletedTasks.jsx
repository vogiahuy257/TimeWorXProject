import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PrimaryButton from '@/Components/PrimaryButton';
import { toast } from 'react-toastify';
import "./css/DeleteTask.css";

const DeletedTasks = ({ resetPage,user_id, projectId }) => {
    const [deletedTasks, setDeletedTasks] = useState([]);

    const fetchDeletedTasks = async () => {
        let response = {};
        try {
            if(projectId != null)
            {
                response = await axios.get(`/api/project-view/${projectId}/deleted-tasks`);
            } 
            else if (user_id != null)
            {
                response = await axios.get(`/api/personal-plans/trashed/${user_id}`);
            }
            setDeletedTasks(response.data);
        } catch (error) {
            toast.error('Lỗi khi lấy danh sách các task đã xóa mềm');
        }
    };

    useEffect(() => {
        fetchDeletedTasks();
    }, []);

    const handleRestore = async (taskId) => {
        try {
            if(projectId != null)
            {
                await axios.put(`/api/project-view/tasks/${taskId}/restore`);
            }
            else if (user_id != null)
            {
                await axios.post(`/api/personal-plans/${taskId}/restore`);
            }
            fetchDeletedTasks();
            resetPage(user_id);
            toast.success('Restore task successfully');
        } catch (error) {
            toast.error('Error restoring task');
        }
    };

    const handlePermanentDelete = async (taskId) => {
        try {
            if(projectId != null)
            {
                await axios.delete(`/api/project-view/tasks/${taskId}/force-delete`);
            }
            else if(user_id != null)
            {
                await axios.delete(`/api/personal-plans/${taskId}/force-delete`);
            }
            fetchDeletedTasks();
            toast.success('Task has been permanently deleted');
        } catch (error) {
            toast.error('Error when permanently deleting task');
        }
    };

    return (
        <div className="deleted-tasks">
            <h2 className='deleted-task-text'>History</h2>
            <ul>
                {deletedTasks.map(task => (
                    <li key={projectId ? task.task_id : task.plan_id}>
                        <p>{projectId ? task.task_name : task.plan_name}</p>
                        <div className='deleted-task-btn'>
                        <PrimaryButton className='btn-restore' onClick={() => handleRestore(projectId ? task.task_id : task.plan_id)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.4 13.8L11.9457 16.2426M11.9457 16.2426L9.59999 13.9105M11.9457 16.2426V10.2426M2.40093 17.541L2.40102 8.41673C2.40102 7.50281 2.40068 6.20108 2.40039 5.25853C2.40019 4.59561 2.93752 4.05884 3.60044 4.05884H9.31865L12.0837 7.01247H20.4C21.0627 7.01247 21.6 7.54976 21.6 8.21251L21.5997 17.5412C21.5996 18.8666 20.5251 19.9411 19.1997 19.9411L4.80092 19.9411C3.47543 19.9411 2.40091 18.8665 2.40093 17.541Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </PrimaryButton>

                        <PrimaryButton className='btn-delete' onClick={() => handlePermanentDelete(projectId ? task.task_id : task.plan_id)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </PrimaryButton>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DeletedTasks;
