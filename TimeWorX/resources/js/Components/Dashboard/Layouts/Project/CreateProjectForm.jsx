import React, { useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import './css/CreateProjectForm.css';

const CreateProjectForm = ({ user_id,  onClose, onSubmit, title, project }) => {

    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [nameError, setNameError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');


    // Hàm để chuyển đổi định dạng ngày từ ISO sang 'yyyy-MM-dd'
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        if (project) {
            setProjectName(project.project_name);
            setProjectDescription(project.project_description);
            setStartDate(formatDate(project.start_date));
            setEndDate(formatDate(project.end_date));  
            setStatus(project.project_status);
        }
    }, [project]);


    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);
        
        // Kiểm tra ngay khi người dùng thay đổi ngày bắt đầu
        if ((startDate != "" || endDate != "") && new Date(newStartDate) > new Date(endDate)) {
            setError('Ngày bắt đầu không được lớn hơn ngày kết thúc.');
        } else {
            setError(''); // Xóa lỗi nếu không có vấn đề
        }
    };
    
    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        setEndDate(newEndDate);
    
        // Kiểm tra ngay khi người dùng thay đổi ngày kết thúc
        if ((startDate != '' || endDate != "") && new Date(startDate) > new Date(newEndDate)) {
            setError('Ngày bắt đầu không được lớn hơn ngày kết thúc.');
        } else {
            setError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!projectName) {
            setNameError('Tên dự án không được để trống.');
            return;
        } else if (projectName.length > 100) {
            setNameError('Tên dự án không được vượt quá 100 ký tự.');
            return;
        } else {
            setNameError('');
        }

        if (!projectDescription) {
            setDescriptionError('Mô tả dự án không được để trống.');
            return;
        } else {
            setDescriptionError('');
        }

        if ((startDate != '' || endDate != "") && new Date(startDate) > new Date(endDate)) {
            setError('Ngày bắt đầu không được lớn hơn ngày kết thúc.');
            return;
        }
        const projectData = {
            project_name: projectName,
            project_description: projectDescription,
            start_date: startDate,
            end_date: endDate,
            project_status: status,
            user_id: user_id,
        };
         onSubmit(projectData);
    };

    return (
        <section id="model-create">
            <main>
            <div className="header">
                <h1>{title}</h1>
                <button className="icon-delete" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            <div className="create-project-form">
                <form onSubmit={handleSubmit}>

                    <label>Project Name</label>
                    <div className='projectName flex flex-col justify-center items-center mb-2'>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) =>setProjectName(e.target.value)}
                        />
                        {nameError && <p className="m-auto error-message">{nameError}</p>}
                    </div>

                    <label>Project Description</label>
                    <div className='project-description flex flex-col justify-center items-center mb-2'>
                        <textarea
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                        />
                        {descriptionError && <p className="error-message">{descriptionError}</p>}
                    </div>

                    <div className='box-input'>
                        <div className='project-date'>
                            <div>
                                <label>Start Date</label>
                                <div>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    required
                                />
                                </div>
                            </div>
                            
                            <p className='text'>-</p>

                            <div>
                                <label>End Date</label>
                                <div>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={handleEndDateChange }
                                    required
                                />
                                </div>
                            </div>
                        </div>
                        {error && <p className="error-message">{error}</p>}
                    </div>

                    <label>Status</label>
                   <div className='project-status mb-3'>
                    <select
                        value={status}
                        onChange={(e) =>  setStatus(e.target.value)}
                    >
                        <option value="null">Select Status</option>
                        <option value="done">Done</option>
                        <option value="in-progress">In Progress</option>
                        <option value="to-do">To Do</option>
                        <option value="verify">Verify</option>
                    </select>
                    </div>

                    <PrimaryButton type="submit" className="btn-submit">
                        {project ? 'Save' : 'Create'}
                    </PrimaryButton>
                </form>
            </div>
            </main>
        </section>
    );
};

export default CreateProjectForm;
