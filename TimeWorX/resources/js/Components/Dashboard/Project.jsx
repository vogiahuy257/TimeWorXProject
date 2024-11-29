
import PrimaryButton from '@/Components/PrimaryButton';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CardProject from '@/Components/Dashboard/Layouts/Project/CardProject';
import CreateProjectForm from '@/Components/Dashboard/Layouts/Project/CreateProjectForm'; 
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeletedProjectsForm from './Layouts/Project/DeletedProjectsForm'; 
import ProjectAnalysis from './Layouts/Project/ProjectAnalysis';


export default function Folder({ auth }) {
    
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [isDeletedFormOpen, setIsDeletedFormOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isOpenProjectAnalysis, setIsOpenProjectAnalysis] = useState(false);
    const [editProject, setEditProject] = useState([]); 
    const [searchQuery, setSearchQuery] = useState('');
    
    const statusOrder = {
        "verify": 1,
        "in-progress": 2,
        "to-do": 3,
        "done": 4
    };

    const sortProjectsByStatus = (projects) => {
        return projects.sort((a, b) => {
            return statusOrder[a.project_status] - statusOrder[b.project_status];
        });
    };

    //hàm gọi api lấy data
    const fetchProjectData = async () => {
        try {
            const response = await axios.get(`/api/projects/${auth.user.id}`);
            const sortedProjects = sortProjectsByStatus(response.data);
            setProjects(sortedProjects);
            setFilteredProjects(sortedProjects);
        } catch (error) {
            toast.error('Error fetching projects:', error.response ? error.response?.error : error.response?.message);
        }
    };
    //hàm tìm kiếm theo mỗi lần nhấn cho project
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        const filtered = projects.filter(project =>
            project.project_name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProjects(filtered);
    };
    
    useEffect(() => {
        fetchProjectData();
    }, []);
    useEffect(() => {
        setFilteredProjects(sortProjectsByStatus(filteredProjects));
    }, [searchQuery]);

    // hàm mới form xóa
    const handleDeletedFormToggle = () => {
        setIsDeletedFormOpen(!isDeletedFormOpen);  
    };

    //hàm đổi lại format lại ngày tháng năm
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

    //hàm hiện thông báo khi xóa chọn yes hoặc no
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
    
    const handleProjectAnalysis = () => 
    {
        setIsOpenProjectAnalysis(!isOpenProjectAnalysis);
    }
    //hàm cho sự kiện khi nhấn vào nút xóa
    const confirmDelete = (projectId) => {
        axios.delete(`/api/projects/${projectId}`)
            .then(() => {
                setProjects(projects.filter(project => project.project_id !== projectId));
                toast.dismiss(); 
                fetchProjectData();
                toast.success('Project deleted successfully!');
            })
            .catch(error => {
                toast.error(`Error deleting project: ${error.response ? error.response.data : error.message}`);
            });
    };

    //hàm mở form tạo dự án
    const handleCreate = () => {
        setIsFormOpen(true); 
        setEditProject(null);  
    };

    // hàm mở form chỉnh sửa dự án
    const handleEdit = (project) => {
        setIsFormOpen(true);  
        setEditProject(project); 
    };

    // submit cho cả 2 form chỉnh sửa và tạo dự án
    const handleSubmitForm = (projectData) => {
        if (editProject)
        {
            // Update project
            axios.put(`/api/projects/${editProject.project_id}`, projectData)
                .then(response => {
                    setProjects(projects.map(p => p.project_id === response.data.project_id ? response.data : p));
                    setIsFormOpen(false); 
                    fetchProjectData();
                    toast.success('Project update successfully!');
                })
                .catch(error => {
                    toast.error(`Error updating project: ${error.message}`);
                });
        }
        else
        {
            // Create new project
            axios.post('/api/projects', projectData)
                .then(response => {
                    setProjects([...projects, response.data]);
                    setIsFormOpen(false); 
                    fetchProjectData();
                    toast.success('Project create successfully!');
                })
                .catch(error => {
                    toast.error(`Error creating project: ${error.message}`);
                });
        }
    };

    return (
        
        <section id='project' >
            <Head title="Project" />
            {/* menu top */}
            <section id='menu'>
                  <div className='block-button-left flex gap-2'>
                         <PrimaryButton  onClick={handleCreate} className='btn-create'>
                            <p>Create Project</p>
                            <svg width="25" height="25" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                             <path d="M19.2192 14.9993H15.0005M15.0005 14.9993H10.7817M15.0005 14.9993V19.218M15.0005 14.9993L15.0005 10.7806M26.25 7.96873L26.25 22.0313C26.25 24.3612 24.3612 26.25 22.0312 26.25H7.96875C5.6388 26.25 3.75 24.3612 3.75 22.0313V7.96873C3.75 5.63879 5.6388 3.75 7.96875 3.75H22.0313C24.3612 3.75 26.25 5.63879 26.25 7.96873Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                         </PrimaryButton>

                         <PrimaryButton onClick={handleProjectAnalysis} className='btn-create btn-report'>
                            <p>Project Progress</p>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2.40002C17.3019 2.40006 21.5999 6.69814 21.5999 12.0001C21.5999 17.302 17.3018 21.6001 11.9999 21.6001C6.69797 21.6001 2.3999 17.302 2.3999 12.0001C2.3999 6.6981 6.698 2.39999 12 2.40002ZM12 2.40002L11.9999 12.0001M11.9999 12.0001L5.3999 18.6001M11.9999 12.0001L5.3999 5.40008" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                         </PrimaryButton>
                  </div>
                  <div className='block-button-right'> 

                    <div className='block-search'>
                            <input 
                                type="text" 
                                name="query" 
                                placeholder="Search projects" 
                                value={searchQuery}
                                onChange={handleSearch} 
                            />
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                    </div>
                        <PrimaryButton onClick={handleDeletedFormToggle} className='btn-delete'>
                                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 13.1429V17.7143C3 18.9767 4.00736 20 5.25 20H18.75C19.9926 20 21 18.9767 21 17.7143V13.1429M3 13.1429L5.82751 5.48315C6.15683 4.59102 6.99635 4 7.93425 4H16.0657C17.0037 4 17.8432 4.59102 18.1725 5.48315L21 13.1429M3 13.1429H7.5L9 14.7429H15L16.5 13.1429H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                        </PrimaryButton>
                  </div>
            </section>
            {/* main */}
            <section id='container'>
                <div className='mainContainer w-full'>

                    <div className='block-project'>

                      {/* title is class name done, to-do, in-progress, verify */}

                      {filteredProjects.map(project => (
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
                        resetPage={fetchProjectData}
                        onClose={handleDeletedFormToggle}
                    />
                )}
            </section>

            {isOpenProjectAnalysis && (
                    <ProjectAnalysis 
                        userId={auth.user.id} 
                        onClose={handleProjectAnalysis}
                    />
            )}
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
