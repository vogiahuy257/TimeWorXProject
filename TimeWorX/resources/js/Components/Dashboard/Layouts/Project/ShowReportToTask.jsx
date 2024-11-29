import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReportComment from './ReportComment';

const ShowReportToTask = ({ auth,task, onClose ,updateTaskStatus }) => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to fetch report data
    const fetchReportData = () => {
        axios.get(`/api/reports/${task.id}`, { params: { project_id: task.project_id, task_id: task.id } })
            .then((response) => {
                setReportData(response.data);
                setLoading(false);
            })
            .catch(() => {
                toast.error('Failed to load report data');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchReportData();
    }, [task]);

    const handDoneReport = (taskId) => {
        updateTaskStatus(taskId,'done');
        onClose();
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { 
            hour: '2-digit', 
            minute: '2-digit', 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour12: true 
        };
        let formattedDate = date.toLocaleString('en-GB', options);
        formattedDate = formattedDate.replace(',', '').replace('/', '-').replace('/', '-');
        return formattedDate;
    };

    return (
    <section id="report-to-task" className='flex justify-center items-center relative '>
        <div className="report-data h-auto m-auto scrollbar-hide relative w-full max-h-full  max-w-[880px] p-4 overflow-y-auto rounded-lg shadow-lg lg:max-w-[80%]">
            <button className=" absolute flex justify-center items-center btn-close z-50 top-4 right-4 p-1.5 rounded-xl" onClick={onClose}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

            <div className='flex flex-col-reverse scrollbar-hide items-center w-full gap-4 overflow-y-auto lg:flex-row'>
                
                <div className="report-content-task-form h-full w-[80%] p-8 pb-4 rounded-lg shadow lg:w-1/2">
                {reportData && reportData.user ?
                (
                    <>
                        <div className="text border-b border-gray-300 pb-3">
                            <h2 className="text-xl">
                            <strong>Report for Task:</strong> {task.content}
                            </h2>
                            <p className="text-xs mt-1">
                                <strong>Create By:</strong> {reportData.user.name}
                            </p>
                            <p className="text-xs mt-1">
                                <strong>Create Date:</strong> {reportData.updated_at ? formatDate(reportData.updated_at) : formatDate(reportData.created_at)}
                            </p>
                        </div>

                        <div className="report-details h-full max-h-[500px] py-2 overflow-y-scroll scrollbar-hide grid grid-cols-1 gap-6">
                            <div className="box-input p-4 border border-gray-200 rounded-md bg-transparent">
                                <h3 className="text-sm font-semibold mb-1">Goals to be complete:</h3>
                                <p className="text-sm">{reportData.completion_goal}</p>
                            </div>

                            <div className="box-input p-4 border border-gray-200 rounded-md bg-transparent">
                                <h3 className="text-sm font-semibold mb-1">Today's work:</h3>
                                <p className="text-sm" dangerouslySetInnerHTML={{ __html: reportData.today_work }} />
                            </div>

                            <div className="box-input p-4 border border-gray-200 rounded-md bg-transparent">
                                <h3 className="text-sm font-semibold mb-1">Things to do next:</h3>
                                <p className="text-sm">{reportData.next_steps}</p>
                            </div>

                            <div className="box-input p-4 border border-gray-200 rounded-md bg-transparent">
                                <h3 className="text-sm font-semibold mb-1">{reportData.isLink ? "Link:" : "Document:"}</h3>
                                {reportData.isLink ? (
                                    <a href={reportData.files[0]?.path} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                                        {reportData.files[0]?.path}
                                    </a>
                                ) : (
                                    reportData.files.map((file, index) => (
                                        file.type !== "link" ? 
                                        (
                                            <p key={index} className="text-sm flex items-center group">
                                            <a 
                                                href={`/storage/${file.path}`} 
                                                download={file.name} 
                                                className="flex items-center transition-colors duration-300 text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                {file.name}
                                            </a>
                                        </p>
                                        ) : 
                                        (
                                                <p className=' text-yellow-500'>No documents have been created for the report</p>
                                        )
                                    ))
                                )}
                            </div>
                            <div className="p-4 border border-gray-200 rounded-md bg-transparent">
                                <h3 className="text-sm font-semibold mb-1">Problems encountered/difficulties:</h3>
                                <p className="text-sm">{reportData.issues}</p>
                            </div>
                        </div>
                        <div className='btn w-full pt-2'>
                                <button onClick={() => handDoneReport(reportData.task_id)} className='px-2 py-[1.5px] rounded-lg m-auto btn-done flex justify-center items-center'>
                                    <h1 className='pl-1 font-medium'>done</h1>
                                    <svg className='ml-1' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                                        <path d="m382-354 339-339q12-12 28-12t28 12q12 12 12 28.5T777-636L410-268q-12 12-28 12t-28-12L182-440q-12-12-11.5-28.5T183-497q12-12 28.5-12t28.5 12l142 143Z"/>
                                    </svg>
                                </button>
                        </div>
                    </>
                ):(
                    <div className='flex flex-col justify-center h-[500px]'>
                    <p className="text-center bg-gray-300 rounded-md p-8 text-gray-800">This task has not been reported yet</p>
                    </div>
                )}
                </div>
                
                <div className='w-[80%] mt-10 h-full report-content-task-form bg-gray-100  rounded-lg shadow-md lg:w-1/2'>
                        <ReportComment taskId={task.id} auth={auth} is_project_manager={true}/>
                </div>
            </div>
        </div>
    </section>

    );
};

export default ShowReportToTask;
