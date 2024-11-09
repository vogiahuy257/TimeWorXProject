import React, { useState,useEffect } from 'react';
import UploadMultipleFiler from './UploadMultipleFiler';
import axios from 'axios';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReportComment from '../Project/ReportComment';

const ReportForm = ({ onClose ,task ,auth}) => {

    //form input
    const [completionGoal, setCompletionGoal] = useState('');
    const [todayWork, setTodayWork] = useState('');
    const [nextSteps, setNextSteps] = useState('');
    const [issues, setIssues] = useState('');
    //docment
    const [documents, setDocuments] = useState([]);
    const [documentLink, setDocumentLink] = useState('');
    const [isLink, setIsLink] = useState(false);
    const [fileSizeError, setFileSizeError] = useState('');
    const [existingReport, setExistingReport] = useState(false);
    const [isExistingReport, setIsExistingReport] = useState(false);

    useEffect(() => {
        axios.get(`/api/reports/${task.id}`, {
            params: {
                project_id: task.project_id,
                task_id: task.id
            }
        }).then((response) => {
            const report = response.data;
            if(report.length == 0)
            {
                setIsExistingReport(false);
            }
            else
            {
                setIsExistingReport(true);
            }
                if (report) 
                {
                    setExistingReport(report);
                    setCompletionGoal(report.completion_goal || '');
                    setTodayWork(report.today_work || '');
                    setNextSteps(report.next_steps || '');
                    setIssues(report.issues || '');
                    setIsLink(report.isLink);

                    if (report.isLink) {
                        setDocumentLink(report.files && report.files.length > 0 ? report.files[0].path : '');
                    } else {
                        setDocuments(report.files || []);
                    }
                }
            })
            .catch((error) => {
                const message = error.response?.data?.message || 'Error submitting report. Please try again.';
                toast.error(`Error: ${message}`);
                onClose();
            });
    }, [task]); 

    const getCurrentDate = () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0'); 
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear(); 
    
        return `${day}-${month}-${year}`; 
    };
     
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const reportData = new FormData();
        reportData.append('report_by_user_id', auth.user.id);
        reportData.append('project_id', task.project_id);
        reportData.append('task_id', task.id);
        reportData.append('completion_goal', completionGoal);
        const formattedTodayWork = todayWork.replace(/\n/g, '<br>');
        reportData.append('today_work', formattedTodayWork);
        reportData.append('next_steps', nextSteps);
        reportData.append('issues', issues);
        reportData.append('isLink', isLink ? '1' : '0');
    
        // Nếu là link thì chỉ append link
        if (isLink) 
        {
            reportData.append('documents', documentLink);
        } 
        else
        {
            documents.forEach((file, index) => {
                if (file instanceof File)
                {
                    reportData.append(`documents[${index}]`, file);
                }
                else if (file.file instanceof File)
                {
                    reportData.append(`documents[${index}]`, file.file);
                }
            });
        }

        const headers = {
             'Content-Type': 'multipart/form-data'
        };
        
        const method = 'post';
        const url = isExistingReport ? `/api/reports/${existingReport.report_id}` : '/api/reports';
        const data = reportData;

        axios[method](url, data, { headers })
        .then((response) => {
            toast.success(response?.data?.message);
            onClose();
        })
        .catch((error) => {
            const message = error.response?.message || 'Error submitting report. Please try again.';
            toast.error(message);
            onClose();
        });
    };
    
    
    
  return (
    <section id="report-form" className='fixed top-0 left-0 w-full h-full z-[999] rounded-lg'>
        <div className=' h-auto m-auto scrollbar-hide relative w-full max-h-full  max-w-[880px] p-4 overflow-y-auto rounded-lg shadow-lg lg:max-w-[80%]'>
            
            <button className='btn-close p-1 rounded-md' onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
                </svg>
            </button>
            <div className='flex flex-col-reverse px-4 items-center w-full gap-4 overflow-y-auto lg:flex-row'>

                <div className='main h-auto w-[90%]  m-auto relative flex flex-col lg:w-1/2'>
                        <div className='text'>
                            <h2>Task Report</h2>
                        </div>
                            
                        <form className='box-form flex flex-col' onSubmit={handleSubmit}>
                            <div className='custom-form custom-scrollbar'>
                                <div className='header-form flex mt-3 mb-2'>
                                    <h1>Task name: {task.content}</h1>
                                    <h1 className='ml-auto'>Date: {getCurrentDate()}</h1>
                                </div>
                                <div className='box-input'>
                                    <h3>Goals to be complete:</h3>
                                    <input type="text"
                                            value={completionGoal}
                                            onChange={(e) =>setCompletionGoal(e.target.value)} 
                                            placeholder="Enter the goals to complete for this task"
                                            required
                                    />
                                    {/* error */}
                                </div>

                                <div className='box-input'>
                                    <h3>Today's work:</h3>
                                    <textarea
                                            value={todayWork.replace(/<br>/g, '\n')}
                                            onChange={(e) =>setTodayWork(e.target.value)} 
                                            placeholder="Describe the work you completed today"
                                            required
                                    />
                                    {/* error */}
                                </div>

                                <div className='box-input'>
                                    <h3>Things to do next:</h3>
                                    <input type='text'
                                            value={nextSteps}
                                            onChange={(e) =>setNextSteps(e.target.value)} 
                                            placeholder="Outline the next steps for this task"
                                            required
                                    />
                                    {/* error */}
                                </div>
                            

                                <div className='box-input'>
                                    <div className='flex items-center mb-2 mt-4'>
                                    <h3>Document:</h3>
                                        <select 
                                            name="upload-type"
                                            id="upload-type"
                                            value={isLink ? 'link' : 'upload'}
                                            onChange={(e) => setIsLink(e.target.value === 'link')}
                                            className="form-select ml-2"
                                        >
                                            <option value="upload">File</option>
                                            <option value="link">Link</option>
                                        </select>
                                    </div>
                                    {/* Nút tải lên tài liệu */}
                                    {isLink ? (
                                        <input
                                            type="text"
                                            value={documentLink}
                                            onChange={(e) => setDocumentLink(e.target.value)}
                                            placeholder="Enter the URL of the document"
                                            required
                                        />
                                    ) : (
                                        <UploadMultipleFiler onFilesChange={(files) => setDocuments(files)} setIsLink={setIsLink} setFileSizeError={setFileSizeError} existingFiles={existingReport ? existingReport.files : []} />
                                    )}
                                    {/* error */}
                                    {fileSizeError && <p className="text-error">{fileSizeError}</p>}
                                </div>

                                <div className='box-input pt-2'>
                                    <h3>Problems encountered/difficulties:</h3>
                                    <input type='text'
                                            value={issues}
                                            onChange={(e) =>setIssues(e.target.value)} 
                                            placeholder="Describe any issues or difficulties encountered"
                                            required
                                    />
                                    {/* error */}
                                </div>
                            </div>

                            <div className='mt-4 flex justify-center'>
                                <button className='btn-submit mb-4' type='submit'>
                                    {isExistingReport ? 'Update Report' : 'Report'}
                                </button>
                            </div>
                        </form>
                </div>

                <div className='w-[90%] report-content-task-form h-auto bg-gray-100 py-4 px-2 rounded-lg shadow-md lg:w-1/2'>
                    <ReportComment auth={auth} taskId={task.id} is_project_manager={false} />
            </div>
        </div>
      </div>
    </section>
  );
};

export default ReportForm;
