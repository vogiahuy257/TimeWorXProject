import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { toast } from 'react-toastify';
import ReportProjectDetail from './Layouts/Report/ReportProjectDetail';
import ReportTaskDone from './Layouts/Report/ReportTaskDone';
import axios from 'axios';

export default function Report({ auth }) {
    const [projects, setProjects] = useState([]);
    const [selectProject, setSelectProject] = useState([]);

    const fetchProjectData = async () => {
        try {
            const response = await axios.get(`/api/projects/${auth.user.id}`);
            setProjects(response.data);
            setSelectProject(response.data[0]);
        
        } catch (error) {
            toast.error('Error fetching projects:', error.response ? error.response?.error : error.response?.message);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, [auth]);

    const handleProjectClick = (project) => {
        setSelectProject(project);
    };

    return (
        <section id='report' className='rounded-lg shadow-inner p-1 overflow-y-auto scrollbar-hide'>
            <Head title="Report" />
            <div className="main w-full p-1 flex flex-col justify-center items-center">
                {projects.length > 0 ? (
                    <div className='w-full h-full'>
                        {/* Danh sách Project */}
                        <div className='w-full flex flex-col lg:flex-row'>
                            
                            <div className={`report-content report-project m-2 p-4 rounded-md shadow-md lg:w-3/5`}>
                                <h2 className="text-header">Project</h2>
                                <div className="project-box flex flex-wrap gap-2 p-1 mt-4 rounded max-h-[200px] overflow-y-auto scrollbar-hide">
                                {projects.map((project) => (
                                    <button 
                                        key={project.project_id}
                                        onClick={() => handleProjectClick(project)}
                                        className={`px-2 rounded-md ${selectProject.project_id == project.project_id ? "active" : ""}`}
                                    >
                                        {selectProject.project_id == project.project_id ? (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M14 4.91927L14 4.9V3H8.4C7.55992 3 7.13988 3 6.81901 3.16349C6.53677 3.3073 6.3073 3.53677 6.16349 3.81901C6 4.13988 6 4.55992 6 5.4V8H8.20471L8.26397 7.99992C8.49595 7.99944 8.75877 7.99891 9.01652 8.06079C9.241 8.11468 9.4556 8.20357 9.65244 8.32419C9.87845 8.46269 10.0639 8.64891 10.2276 8.81328L10.2276 8.81329L10.2695 8.85525L12.1448 10.7305C12.2547 10.8405 12.3141 10.8995 12.3603 10.9417C12.3804 10.9601 12.3915 10.9691 12.3959 10.9726C12.4118 10.9818 12.4288 10.9889 12.4465 10.9935C12.4522 10.9942 12.4664 10.9957 12.4935 10.9969C12.5561 10.9998 12.6398 11 12.7953 11H17.9992C18 10.8781 18 10.7454 18 10.6V7H16.1L16.0807 7C15.8172 7.00001 15.5898 7.00002 15.4025 6.98471C15.2048 6.96856 15.0082 6.93291 14.819 6.83651C14.5368 6.6927 14.3073 6.46323 14.1635 6.18099C14.0671 5.9918 14.0314 5.79519 14.0153 5.59751C14 5.41023 14 5.18285 14 4.91927ZM12.6113 13C12.412 12.9988 12.196 12.9902 11.9835 12.9392C11.759 12.8853 11.5444 12.7964 11.3476 12.6758C11.1215 12.5373 10.9361 12.3511 10.7724 12.1867L10.7305 12.1448L8.85525 10.2695C8.74532 10.1595 8.68595 10.1005 8.63966 10.0583C8.61959 10.0399 8.60852 10.0309 8.60405 10.0274C8.58823 10.0182 8.57121 10.0111 8.55347 10.0065C8.54784 10.0058 8.53364 10.0043 8.50649 10.0031C8.4439 10.0002 8.36017 10 8.20471 10H6V10.6C6 11.4401 6 11.8601 6.16349 12.181C6.3073 12.4632 6.53677 12.6927 6.81901 12.8365C7.13988 13 7.55992 13 8.4 13H12.6113ZM15 4.9V3.08982C15.0372 3.10674 15.0733 3.12595 15.1083 3.14736C15.2092 3.2092 15.2957 3.29568 15.4686 3.46862L15.4686 3.46863L17.5314 5.53137C17.7043 5.70432 17.7908 5.7908 17.8526 5.89172C17.874 5.92665 17.8933 5.96282 17.9102 6H16.1C15.8117 6 15.6256 5.99961 15.4839 5.98804C15.3481 5.97694 15.2977 5.9581 15.273 5.9455C15.1789 5.89757 15.1024 5.82108 15.0545 5.72699C15.0419 5.70227 15.0231 5.65191 15.012 5.51608C15.0004 5.37441 15 5.18828 15 4.9Z" fill="currentColor" fillOpacity="0.5"/>
                                            <path d="M3 11.4C3 10.5599 3 10.1399 3.16349 9.81901C3.3073 9.53677 3.53677 9.3073 3.81901 9.16349C4.13988 9 4.55992 9 5.4 9H8.20471C8.49822 9 8.64497 9 8.78308 9.03316C8.90552 9.06255 9.02258 9.11104 9.12994 9.17683C9.25104 9.25104 9.35481 9.35481 9.56236 9.56236L11.4376 11.4376C11.6452 11.6452 11.749 11.749 11.8701 11.8232C11.9774 11.889 12.0945 11.9374 12.2169 11.9668C12.355 12 12.5018 12 12.7953 12H18.6C19.4401 12 19.8601 12 20.181 12.1635C20.4632 12.3073 20.6927 12.5368 20.8365 12.819C21 13.1399 21 13.5599 21 14.4V19.6C21 20.4401 21 20.8601 20.8365 21.181C20.6927 21.4632 20.4632 21.6927 20.181 21.8365C19.8601 22 19.4401 22 18.6 22H5.4C4.55992 22 4.13988 22 3.81901 21.8365C3.53677 21.6927 3.3073 21.4632 3.16349 21.181C3 20.8601 3 20.4401 3 19.6V11.4Z" fill="currentColor"/>
                                            </svg>
                                            
                                        ) : (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 8H16.2C17.8802 8 18.7202 8 19.362 8.32698C19.9265 8.6146 20.3854 9.07354 20.673 9.63803C21 10.2798 21 11.1198 21 12.8V14.2C21 15.8802 21 16.7202 20.673 17.362C20.3854 17.9265 19.9265 18.3854 19.362 18.673C18.7202 19 17.8802 19 16.2 19H7.8C6.11984 19 5.27976 19 4.63803 18.673C4.07354 18.3854 3.6146 17.9265 3.32698 17.362C3 16.7202 3 15.8802 3 14.2V8Z" fill="currentColor"/>
                                            <path d="M3 8C3 7.06812 3 6.60218 3.15224 6.23463C3.35523 5.74458 3.74458 5.35523 4.23463 5.15224C4.60218 5 5.06812 5 6 5H8.34315C9.16065 5 9.5694 5 9.93694 5.15224C10.3045 5.30448 10.5935 5.59351 11.1716 6.17157L13 8H3Z" fill="currentColor"/>
                                        </svg>
                                        )}
                                        <h3 className='pb-1 break-words whitespace-normal overflow-hidden'>{project.project_name}</h3>
                                    </button>
                                ))}
                                </div>
                            </div>
                            {/* xem chi tiết project */}
                            <div className={`h-52 report-content detail-box m-2 p-4 rounded-md shadow-md relative lg:w-2/5 lg:h-auto`}>
                                <ReportProjectDetail project = {selectProject} user_id = {auth.user.id} />
                            </div>
                            
                        </div>
                        
                        {/* Task Done của Project */}
                        <div className='w-full flex flex-col md:flex-row'>
                            <div className="md:w-2/5 report-content report-task-done m-2 p-4 rounded-md shadow-md ">
                                <h2 className="text-header">Task done</h2>
                                {/* Hiển thị task của project đã chọn */}
                                <ReportTaskDone project_id = {selectProject.project_id}/>
                            </div>

                            {/* Tổng Hợp */}
                            <div className="md:w-3/5 report-content report-summary m-2 p-4 rounded-md shadow-md ">
                                <h2 className="text-header">Summary Report</h2>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No projects available.</p>
                )}
            </div>
        </section>
    );
}
