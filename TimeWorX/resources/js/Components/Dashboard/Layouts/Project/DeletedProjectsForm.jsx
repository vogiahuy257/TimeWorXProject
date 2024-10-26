import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./css/DeletedProjectFrom.css";

const DeletedProjectsForm = ({ auth ,resetPage, onClose }) => {
    
    const [deletedProjects, setDeletedProjects] = useState([]);
    const fetchDeletedProjects = () => {
        axios.get(`/api/projects/deleted/${auth.user.id}`)
            .then(response => {
                setDeletedProjects(response.data);
            })
            .catch(error => {
                toast.error(`Error fetching deleted projects: ${error.response ? error.response.data : error.message}`);
            });
    };
    useEffect(() => {
        fetchDeletedProjects();
    }, []);

    const restoreProject = (projectId) => {
        axios.get(`/api/projects/restore/${projectId}`)
            .then(response => {
                toast.success(response.data.message);
                setDeletedProjects(prev => prev.filter(p => p.project_id !== projectId));
                resetPage();
            })
            .catch(error => {
                toast.error(`Error restoring project: ${error.response ? error.response.data : error.message}`);
            });  
    };
    
    const permanentlyDeleteProject = (projectId) => {
        axios.delete(`/api/projects/permanently-delete/${projectId}`)
            .then(response => {
                toast.success(response.data.message);
                setDeletedProjects(prev => prev.filter(p => p.project_id !== projectId));
            })
            .catch(error => {
                toast.error(`Error permanently deleting project: ${error.response ? error.response.data : error.message}`);
            });
    };

    return (
        <div className="deleted-projects-form">
            <div className='header'>
                <h2>History</h2>
                <button onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
                    </svg></button>
            </div>
            <div className='list-delete-project'>
                <ul>
                    {deletedProjects.map(project => (
                        <li key={project.project_id}>
                            <p className='line-clamp-1 w-24'>{project.project_name}</p>
                            <div className='box-button'>
                            <button onClick={() => restoreProject(project.project_id)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.4 13.8L11.9457 16.2426M11.9457 16.2426L9.59999 13.9105M11.9457 16.2426V10.2426M2.40093 17.541L2.40102 8.41673C2.40102 7.50281 2.40068 6.20108 2.40039 5.25853C2.40019 4.59561 2.93752 4.05884 3.60044 4.05884H9.31865L12.0837 7.01247H20.4C21.0627 7.01247 21.6 7.54976 21.6 8.21251L21.5997 17.5412C21.5996 18.8666 20.5251 19.9411 19.1997 19.9411L4.80092 19.9411C3.47543 19.9411 2.40091 18.8665 2.40093 17.541Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            </button>
                            <button onClick={() => permanentlyDeleteProject(project.project_id)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DeletedProjectsForm;
