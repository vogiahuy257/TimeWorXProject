
import PrimaryButton from '@/Components/PrimaryButton';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CardProject from '@/Components/Dashboard/Layouts/Project/CardProject';
import CreateProjectForm from '@/Components/Dashboard/Layouts/Project/CreateProjectForm'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeletedProjectsForm from '@/Components/Dashboard/Layouts/Project/DeletedProjectsForm'; 

export default function Folder({ auth }) {
    const [projects, setProjects] = useState([]);
    const [isDeletedFormOpen, setIsDeletedFormOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);  
    const [editProject, setEditProject] = useState([]); 

   
    useEffect(() => {
        // gọi phương thức show trong ProjectController
        axios.get(`/api/projects/${auth.user.id}`)
            .then(response => {
                setProjects(response.data);
            })
            .catch(error => {
                console.error('Error fetching projects:', error.response ? error.response.data : error.message);
            });
    }, []);

    const handleDeletedFormToggle = () => {
        setIsDeletedFormOpen(!isDeletedFormOpen);  
    };

    const formatDateRange = (startDate, endDate) => {
        const optionsWithYear = { day: '2-digit', month: 'short', year: 'numeric' };
        const optionsWithoutYear = { day: '2-digit', month: 'short' };
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (start.getFullYear() === end.getFullYear()) {
            const formattedStart = start.toLocaleDateString('en-GB', optionsWithoutYear);
            const formattedEnd = end.toLocaleDateString('en-GB', optionsWithYear); 
            return `${formattedStart} - ${formattedEnd}`;
        } else {
            const formattedStart = start.toLocaleDateString('en-GB', optionsWithYear);
            const formattedEnd = end.toLocaleDateString('en-GB', optionsWithYear);
            return `${formattedStart} - ${formattedEnd}`;
        }
    };

    const handleDelete = (projectId) => {
        toast.info(
            <div id='customToastInfo'>
                <p>Are you sure you want to delete this project?</p>
                <div className='box-btn'>
                    <button  onClick={() => confirmDelete(projectId)}>Yes</button>
                    <button onClick={()=>toast.dismiss()} className='btn-no'>No</button>
                </div>
            </div>,
            { autoClose: false }
        );
    };
    
    const confirmDelete = (projectId) => {
        axios.delete(`/api/projects/${projectId}`)
            .then(() => {
                setProjects(projects.filter(project => project.project_id !== projectId));
                toast.dismiss(); 
                toast.success('Project deleted successfully!');
            })
            .catch(error => {
                toast.error(`Error deleting project: ${error.response ? error.response.data : error.message}`);
            });
    };

    const handleCreate = () => {
        setIsFormOpen(true);  // Mở form tạo mới
        setEditProject(null);  
    };

    const handleEdit = (project) => {
        setIsFormOpen(true);  // Mở form chỉnh sửa
        setEditProject(project); 
    };

    const handleSubmitForm = (projectData) => {
        if (editProject)
        {
            // Update project
            axios.put(`/api/projects/${editProject.project_id}`, projectData)
                .then(response => {
                    setProjects(projects.map(p => p.project_id === response.data.project_id ? response.data : p));
                    setIsFormOpen(false);  // Đóng form
                })
                .catch(error => {
                    toast.error('Error updating project:', error.response ? error.response.data : error.message);
                });
        }
        else
        {
            // Create new project
            axios.post('/api/projects', projectData)
                .then(response => {
                    setProjects([...projects, response.data]);
                    setIsFormOpen(false);  // Đóng form
                })
                .catch(error => {
                    toast.error('Error creating project:', error.response ? error.response.data : error.message);
                });
        }
    };

    return (
        
        <section id='project'>
            <Head title="Project" />
            <ToastContainer className="custom_toast"/>
            {/* menu top */}
            <section id='menu'>
                  <div className='block-button-left'>
                         <PrimaryButton  onClick={handleCreate} className='btn-create'>
                            <p>Create Project</p>
                            <svg width="25" height="25" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                             <path d="M19.2192 14.9993H15.0005M15.0005 14.9993H10.7817M15.0005 14.9993V19.218M15.0005 14.9993L15.0005 10.7806M26.25 7.96873L26.25 22.0313C26.25 24.3612 24.3612 26.25 22.0312 26.25H7.96875C5.6388 26.25 3.75 24.3612 3.75 22.0313V7.96873C3.75 5.63879 5.6388 3.75 7.96875 3.75H22.0313C24.3612 3.75 26.25 5.63879 26.25 7.96873Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                         </PrimaryButton>
                  </div>
                  <div className='block-button-right'> 
                        <PrimaryButton onClick={handleDeletedFormToggle} className='btn-delete'>
                                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 13.1429V17.7143C3 18.9767 4.00736 20 5.25 20H18.75C19.9926 20 21 18.9767 21 17.7143V13.1429M3 13.1429L5.82751 5.48315C6.15683 4.59102 6.99635 4 7.93425 4H16.0657C17.0037 4 17.8432 4.59102 18.1725 5.48315L21 13.1429M3 13.1429H7.5L9 14.7429H15L16.5 13.1429H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                        </PrimaryButton>
                  </div>
            </section>
            {/* main */}
            <section id='container'>
                <div className='mainContainer'>
                <div className='menu'>
                    <div className='block-text'>
                         <h1>Your project</h1>
                    </div>

                    <div className='block-search'>

                        <form action="" method="">
                            <input type="text" name="query" placeholder="Search projects" />
                            <button type="submit">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </form>

                    </div>
                </div>

                    <div className='block-project'>

                      {/* title is class name done, to-do, in-progress, verify */}

                      {projects.map(project => (
                            <CardProject
                                key={project.project_id}
                                project={project}
                                formatDateRange={formatDateRange}
                                handleDelete={handleDelete}
                                handleEdit={handleEdit}
                            />
                        ))}

                    </div>
                </div>
                
                {isDeletedFormOpen && (
                    <DeletedProjectsForm
                        auth={auth}
                        onClose={handleDeletedFormToggle}
                    />
                )}
            </section>

            {/* from model */}
            {isFormOpen && (
                <CreateProjectForm
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleSubmitForm}
                    title={editProject ? 'Edit Project' : 'Create Project'}
                    project={editProject}
                    user_id={auth.user.id}
                />
            )}
        </section>
    );
}
