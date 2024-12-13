import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { toast } from 'react-toastify';
import ReportProjectDetail from './Layouts/Report/ReportProjectDetail';
import ReportTaskDone from './Layouts/Report/ReportTaskDone';
import ReportTaskForm from './Layouts/Report/ReportTaskForm';
import axios from 'axios';
import SummaryReport from './Layouts/Report/SummaryReport';
import SummaryReportForm from './Layouts/Report/SummaryReportForm';

export default function Report({ auth }) {
    const [projects, setProjects] = useState([]);
    const [selectProject, setSelectProject] = useState([]);
    const [isOpenShowReportToTask,setIsOpenShowReportToTask] = useState(false);
    const [selectTask, setSelectTask] = useState();

    const openFormReportToTask = (task) =>
    {
        setIsOpenShowReportToTask(!isOpenShowReportToTask);
        if(task) setSelectTask(task);
    }

    const fetchProjectData = async () => {
        try {
            const response = await axios.get(`/api/projects/${auth.user.id}`);
            setProjects(response.data);
            setSelectProject(response.data[0]);
        } catch (error) {
            const errorMsg = error.response?.data?.message || "An error occurred while fetching projects.";
            toast.error(errorMsg);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, [auth]);

    const handleProjectClick = (project) => {
        setSelectProject(project);
    };

    //SummaryReportForm logic
    const [isOpenFormSummary,setIsOpenFormSummary] = useState(false);

     // Hàm mở form
     const handleOpenForm = () => {
        setIsOpenFormSummary(!isOpenFormSummary);
    };

    return (
        <section id='report' className='rounded-lg overflow-auto scrollbar-hide lg:overflow-clip'>
            <Head title="Report" />
            <div className="main w-full flex justify-center items-center">
                {projects.length > 0 ? (
                    <div className='m-4 w-full h-full flex flex-col lg:flex-row gap-4'>
                        {/* Danh sách Project */}
                        <div className='gap-4 w-full h-full flex flex-col-reverse lg:w-1/2'>
                            
                            <div className='gap-4 flex flex-col md:flex-row'>   
                                <div className={`report-content report-project p-4 rounded-md shadow-md md:w-1/2 mx-auto`}>
                                    <h2 className="text-header">Project</h2>
                                    <div className="project-box flex flex-wrap gap-4 p-2 mx-auto mt-4 w-auto rounded max-h-[290px] overflow-y-auto scrollbar-hide">
                                    {projects.map((project) => (
                                        <button 
                                            key={project.project_id}
                                            onClick={() => handleProjectClick(project)}
                                            className={`py-2 rounded-md ${project.project_status} relative  ${selectProject.project_id == project.project_id ? "active" : ""}`}
                                        >
                                            {selectProject.project_id == project.project_id ? (
                                                <>
                                                    <svg className='relative' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path className='icon-path1' fillRule="evenodd" clipRule="evenodd" d="M14 4.91927L14 4.9V3H8.4C7.55992 3 7.13988 3 6.81901 3.16349C6.53677 3.3073 6.3073 3.53677 6.16349 3.81901C6 4.13988 6 4.55992 6 5.4V8H8.20471L8.26397 7.99992C8.49595 7.99944 8.75877 7.99891 9.01652 8.06079C9.241 8.11468 9.4556 8.20357 9.65244 8.32419C9.87845 8.46269 10.0639 8.64891 10.2276 8.81328L10.2276 8.81329L10.2695 8.85525L12.1448 10.7305C12.2547 10.8405 12.3141 10.8995 12.3603 10.9417C12.3804 10.9601 12.3915 10.9691 12.3959 10.9726C12.4118 10.9818 12.4288 10.9889 12.4465 10.9935C12.4522 10.9942 12.4664 10.9957 12.4935 10.9969C12.5561 10.9998 12.6398 11 12.7953 11H17.9992C18 10.8781 18 10.7454 18 10.6V7H16.1L16.0807 7C15.8172 7.00001 15.5898 7.00002 15.4025 6.98471C15.2048 6.96856 15.0082 6.93291 14.819 6.83651C14.5368 6.6927 14.3073 6.46323 14.1635 6.18099C14.0671 5.9918 14.0314 5.79519 14.0153 5.59751C14 5.41023 14 5.18285 14 4.91927ZM12.6113 13C12.412 12.9988 12.196 12.9902 11.9835 12.9392C11.759 12.8853 11.5444 12.7964 11.3476 12.6758C11.1215 12.5373 10.9361 12.3511 10.7724 12.1867L10.7305 12.1448L8.85525 10.2695C8.74532 10.1595 8.68595 10.1005 8.63966 10.0583C8.61959 10.0399 8.60852 10.0309 8.60405 10.0274C8.58823 10.0182 8.57121 10.0111 8.55347 10.0065C8.54784 10.0058 8.53364 10.0043 8.50649 10.0031C8.4439 10.0002 8.36017 10 8.20471 10H6V10.6C6 11.4401 6 11.8601 6.16349 12.181C6.3073 12.4632 6.53677 12.6927 6.81901 12.8365C7.13988 13 7.55992 13 8.4 13H12.6113ZM15 4.9V3.08982C15.0372 3.10674 15.0733 3.12595 15.1083 3.14736C15.2092 3.2092 15.2957 3.29568 15.4686 3.46862L15.4686 3.46863L17.5314 5.53137C17.7043 5.70432 17.7908 5.7908 17.8526 5.89172C17.874 5.92665 17.8933 5.96282 17.9102 6H16.1C15.8117 6 15.6256 5.99961 15.4839 5.98804C15.3481 5.97694 15.2977 5.9581 15.273 5.9455C15.1789 5.89757 15.1024 5.82108 15.0545 5.72699C15.0419 5.70227 15.0231 5.65191 15.012 5.51608C15.0004 5.37441 15 5.18828 15 4.9Z" fill="currentColor" fillOpacity="0.5"/>
                                                        <path className="icon-path2"  d="M3 11.4C3 10.5599 3 10.1399 3.16349 9.81901C3.3073 9.53677 3.53677 9.3073 3.81901 9.16349C4.13988 9 4.55992 9 5.4 9H8.20471C8.49822 9 8.64497 9 8.78308 9.03316C8.90552 9.06255 9.02258 9.11104 9.12994 9.17683C9.25104 9.25104 9.35481 9.35481 9.56236 9.56236L11.4376 11.4376C11.6452 11.6452 11.749 11.749 11.8701 11.8232C11.9774 11.889 12.0945 11.9374 12.2169 11.9668C12.355 12 12.5018 12 12.7953 12H18.6C19.4401 12 19.8601 12 20.181 12.1635C20.4632 12.3073 20.6927 12.5368 20.8365 12.819C21 13.1399 21 13.5599 21 14.4V19.6C21 20.4401 21 20.8601 20.8365 21.181C20.6927 21.4632 20.4632 21.6927 20.181 21.8365C19.8601 22 19.4401 22 18.6 22H5.4C4.55992 22 4.13988 22 3.81901 21.8365C3.53677 21.6927 3.3073 21.4632 3.16349 21.181C3 20.8601 3 20.4401 3 19.6V11.4Z" fill="currentColor"/>
                                                    </svg>
                                                    {project.project_status == 'done' ? (<svg className='image-done' xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor"><path d="m424-408-86-86q-11-11-28-11t-28 11q-11 11-11 28t11 28l114 114q12 12 28 12t28-12l226-226q11-11 11-28t-11-28q-11-11-28-11t-28 11L424-408Zm56 328q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>) : null}
                                                </>
                                            ) : (
                                                <>
                                                    <svg className='relative' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path className="icon-path2" d="M3 8H16.2C17.8802 8 18.7202 8 19.362 8.32698C19.9265 8.6146 20.3854 9.07354 20.673 9.63803C21 10.2798 21 11.1198 21 12.8V14.2C21 15.8802 21 16.7202 20.673 17.362C20.3854 17.9265 19.9265 18.3854 19.362 18.673C18.7202 19 17.8802 19 16.2 19H7.8C6.11984 19 5.27976 19 4.63803 18.673C4.07354 18.3854 3.6146 17.9265 3.32698 17.362C3 16.7202 3 15.8802 3 14.2V8Z" fill="currentColor"/>
                                                        <path className="icon-path2" d="M3 8C3 7.06812 3 6.60218 3.15224 6.23463C3.35523 5.74458 3.74458 5.35523 4.23463 5.15224C4.60218 5 5.06812 5 6 5H8.34315C9.16065 5 9.5694 5 9.93694 5.15224C10.3045 5.30448 10.5935 5.59351 11.1716 6.17157L13 8H3Z" fill="currentColor"/>
                                                    </svg>
                                                    {project.project_status == 'done' ? (<svg className='image-done' xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor"><path d="m424-408-86-86q-11-11-28-11t-28 11q-11 11-11 28t11 28l114 114q12 12 28 12t28-12l226-226q11-11 11-28t-11-28q-11-11-28-11t-28 11L424-408Zm56 328q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>) : null}
                                                </>
                                            )}
                                        <h3 className="w-full pb-1 break-words whitespace-nowrap overflow-hidden text-ellipsis truncate">{project.project_name}</h3>
                                        </button>
                                    ))}
                                    </div>
                                </div>
                            
                                <div className=" h-full report-content relative report-task-done rounded-md md:w-1/2">
                                    <h2 className="text-header text-report-done shadow-sm">Task Completed</h2>
                                    {/* Hiển thị task của project đã chọn */}
                                    <ReportTaskDone project_id = {selectProject.project_id} onOpenReportTaskForm={openFormReportToTask}/>
                                </div>
                            </div>
                            {/* xem chi tiết project */}
                            <div className={`h-52 report-content detail-box rounded-md relative`}>
                                <ReportProjectDetail project = {selectProject} user_id = {auth.user.id} />
                            </div>

                        </div>
                        
                        {/* Task Done của Project */}
                        <div className='w-full h-full flex flex-row lg:w-1/2'>
                            <div className="w-full report-content report-summary p-2 rounded-md shadow-md  relative">
                                <h2 className="text-header">Summary Report</h2>
                                <SummaryReport auth={auth} handleOpenForm = {handleOpenForm}/>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No projects available.</p>
                )}
            </div>
            {isOpenShowReportToTask && <ReportTaskForm auth={auth} onClose={openFormReportToTask} task={selectTask} />}
            {isOpenFormSummary && <SummaryReportForm auth={auth} projectIdChange={selectProject.project_id} handleOpenForm = {handleOpenForm}/>}
        </section>
    );
}
