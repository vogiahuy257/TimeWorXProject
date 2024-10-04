import { Link } from 'react-router-dom';
import React from 'react';
import './css/CardProject.css';

export default function CardProject({ project, formatDateRange, handleDelete,handleEdit}) {

    return (
        <div className={`card ${project.project_status || ''}`} key={project.project_id}>
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
                    <p className='line-clamp-2'>{project.project_name}</p>
                    <p className='description line-clamp-2'>{project.project_description}</p>
                </div>

                <div className='card-form'>
                    <Link className='card-form-view' to={`/dashboard/projects/${project.project_id}`}>
                        <h1>View</h1>
                    </Link>

                    <Link className='card-form-edit' onClick={() => handleEdit(project)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.7999 15.6L8.9999 19.2M4.1999 15.6L16.0313 3.35545C17.3052 2.08155 19.3706 2.08155 20.6445 3.35545C21.9184 4.62935 21.9184 6.69475 20.6445 7.96865L8.3999 19.8L2.3999 21.6L4.1999 15.6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>


                    <Link className='card-form-delete' onClick={() => handleDelete(project.project_id)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6.17647H20M10 16.7647V10.4118M14 16.7647V10.4118M16 21H8C6.89543 21 6 20.0519 6 18.8824V7.23529C6 6.65052 6.44772 6.17647 7 6.17647H17C17.5523 6.17647 18 6.65052 18 7.23529V18.8824C18 20.0519 17.1046 21 16 21ZM10 6.17647H14C14.5523 6.17647 15 5.70242 15 5.11765V4.05882C15 3.47405 14.5523 3 14 3H10C9.44772 3 9 3.47405 9 4.05882V5.11765C9 5.70242 9.44772 6.17647 10 6.17647Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
