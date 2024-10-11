import React, { useState } from 'react';
import UploadMultipleFiler from './UploadMultipleFiler';
const ReportForm = ({ onClose ,task}) => {
    const [reportByUserId, setReportByUserId] = useState('');
    const [projectId, setProjectId] = useState('');
    const [taskId, setTaskId] = useState(task ? task.task_id : '');
    const [reportTitle, setReportTitle] = useState('');
    const [statusReport, setStatusReport] = useState('');
    const [completionGoal, setCompletionGoal] = useState('');
    const [todayWork, setTodayWork] = useState('');
    const [nextSteps, setNextSteps] = useState('');
    const [issues, setIssues] = useState('');
    const [documents, setDocuments] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const reportData = {
            report_by_user_id: reportByUserId,
            project_id: projectId,
            task_id: taskId,
            report_title: reportTitle,
            status_report: statusReport,
            completion_goal: completionGoal,
            today_work: todayWork,
            next_steps: nextSteps,
            issues: issues,
            documents: documents
        };

        // Gửi dữ liệu báo cáo (thêm mã xử lý gửi ở đây)
        console.log('Report data:', reportData);

        // Đây là ví dụ, bạn có thể gửi `reportData` bằng fetch hoặc axios
        // Ví dụ với fetch:
        /*
        fetch('/api/upload', {
            method: 'POST',
            body: reportData
        }).then(response => {
            if (response.ok) {
                // Xử lý sau khi upload thành công
            }
        }).catch(error => {
            console.error('Error:', error);
        });
        */

    };

  return (
    <section id="report-form">
      <div className='main'>

                <button className='btn-close' onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
                    </svg>
                </button>

            <div className='text'>
                <h2>Report Form</h2>
            </div>
                
            <form className='box-form flex flex-col' onSubmit={handleSubmit}>
                <div className='custom-form custom-scrollbar'>
                    <div className='header-form flex mt-4 mb-4'>
                        <h1>Task name: {task.content}</h1>
                        <h1 className='ml-auto'>date: 10/10/2024</h1>
                    </div>
                    <div className='box-input'>
                        <h3>Goals to be complete:</h3>
                        <input type="text"
                                value={completionGoal}
                                onChange={(e) =>setCompletionGoal(e.target.value)} 
                                required
                        />
                        {/* error */}
                    </div>

                    <div className='box-input'>
                        <h3>Today's work:</h3>
                        <textarea
                                value={todayWork}
                                onChange={(e) =>setTodayWork(e.target.value)} 
                                required
                        />
                        {/* error */}
                    </div>

                    <div className='box-input'>
                        <h3>Things to do next:</h3>
                        <input type='text'
                                value={nextSteps}
                                onChange={(e) =>setNextSteps(e.target.value)} 
                                required
                        />
                        {/* error */}
                    </div>
                

                    <div className='box-input'>
                        <h3>Document:</h3>
                        {/* Nút tải lên tài liệu */}
                        <UploadMultipleFiler onFilesChange={(files) => setDocuments(files)} />
                        {/* error */}
                    </div>

                    <div className='box-input'>
                        <h3>Problems encountered/difficulties:</h3>
                        <input type='text'
                                value={issues}
                                onChange={(e) =>setIssues(e.target.value)} 
                                required
                        />
                        {/* error */}
                    </div>
                </div>

                <div className='mt-auto flex justify-center'>
                    <button className='btn-submit mb-4' type='submit'>Submit</button>
                </div>
            </form>
      </div>
    </section>
  );
};

export default ReportForm;
