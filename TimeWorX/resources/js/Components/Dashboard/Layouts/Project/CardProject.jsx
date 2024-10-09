import { Link } from 'react-router-dom';
import React from 'react';
import './css/CardProject.css';

export default function CardProject({ project, formatDateRange, handleDelete,handleEdit}) {

    return (
        <div className={`card ${project.project_status || ''}`} key={project.project_id}>
            <Link className='card-form-view' to={`/dashboard/projects/${project.project_id}`}>

            <div className='card-title'>
                <div className='card-title-text'>
                    {project.project_status || 'Status'}
                </div>
                <div className='card-title-date'>
                    {formatDateRange(project.start_date, project.end_date)}
                </div>
            </div>

            <div className='card-header'>
                <div className='text'>

                    <div className='card-form'>
                        <p className='line-clamp-2'>{project.project_name}</p>

                        <div className='btn-form'>
                            <Link className='btn card-form-edit' onClick={() => handleEdit(project)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.7999 15.6L8.9999 19.2M4.1999 15.6L16.0313 3.35545C17.3052 2.08155 19.3706 2.08155 20.6445 3.35545C21.9184 4.62935 21.9184 6.69475 20.6445 7.96865L8.3999 19.8L2.3999 21.6L4.1999 15.6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>


                            <Link className='btn card-form-delete' onClick={() => handleDelete(project.project_id)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 6.17647H20M10 16.7647V10.4118M14 16.7647V10.4118M16 21H8C6.89543 21 6 20.0519 6 18.8824V7.23529C6 6.65052 6.44772 6.17647 7 6.17647H17C17.5523 6.17647 18 6.65052 18 7.23529V18.8824C18 20.0519 17.1046 21 16 21ZM10 6.17647H14C14.5523 6.17647 15 5.70242 15 5.11765V4.05882C15 3.47405 14.5523 3 14 3H10C9.44772 3 9 3.47405 9 4.05882V5.11765C9 5.70242 9.44772 6.17647 10 6.17647Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    <p className='description line-clamp-2'>{project.project_description}</p>
                    
                    {/* notification deadlinetask */}
                    <div className='custom-notification mt-auto flex items-center'>
                        <div className='custom_complete'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                                <path d="m437-355-56-56q-6-6-13-9t-14.5-3q-7.5 0-15 3t-13.5 9q-12 12-12 28.5t12 28.5l85 86q6 6 13 8.5t15 2.5q8 0 15-2.5t13-8.5l169-169q12-12 12-29t-12-29q-12-12-29-12t-29 12L437-355ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h287q16 0 30.5 6t25.5 17l194 194q11 11 17 25.5t6 30.5v447q0 33-23.5 56.5T720-80H240Zm280-560v-160H240v640h480v-440H560q-17 0-28.5-11.5T520-640ZM240-800v200-200 640-640Z"/>
                                </svg>
                                <p>3/10</p>
                        </div>
                        <div className='ml-auto flex gap-2'>
                            {project.late_tasks_count > 0 && (
                                <div className='custom-late-task flex items-center justify-center'>
                                    <p className='line-clamp-2'>{project.late_tasks_count}</p>
                                    
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.47 21H19.53C21.07 21 22.03 19.33 21.26 18L13.73 4.98999C12.96 3.65999 11.04 3.65999 10.27 4.98999L2.74 18C1.97 19.33 2.93 21 4.47 21ZM12 14C11.45 14 11 13.55 11 13V11C11 10.45 11.45 9.99999 12 9.99999C12.55 9.99999 13 10.45 13 11V13C13 13.55 12.55 14 12 14ZM13 18H11V16H13V18Z" fill="currentColor"/>
                                    </svg>
                                </div>
                            )}
                            {project.near_deadline_tasks_count > 0 && (
                                <div className='custom-near-task flex items-center justify-center'>
                                    <p className='line-clamp-2'>{project.near_deadline_tasks_count}</p>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 13C11.45 13 11 12.55 11 12V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V12C13 12.55 12.55 13 12 13ZM13 17H11V15H13V17Z" fill="currentColor"/>
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            </Link>
        </div>
    );
}
