import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ShowReportToTask = ({ task, onClose }) => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/reports/${task.id}`, {
            params: {
                project_id: task.project_id,
                task_id: task.id
            }
        })
        .then((response) => {
            setReportData(response.data);
            setLoading(false);
        })
        .catch((error) => {
            toast.error('Failed to load report data');
            setLoading(false);
        });
            
    }, [task]);

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

    if (loading) {
        return <section id="report-to-task">
        <div className="report-data relative">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500" onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            <div className="report-content report-task-form p-8">
                <div className="text-lg font-bold text-gray-800">Loading...</div>
            </div>
        </div>
    </section>;
    }

    if (!reportData || !reportData.user) {
        return (
            <section id="report-to-task">
                <div className="report-data relative">
                    <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div className="report-content report-task-form p-8">
                        <h2 className="text-xl">
                            <strong>Report for Task:</strong> {task.content}
                        </h2>
                    </div>
                    <div className='m-auto flex justify-center items-center'>
                        <p className='text-center bg-gray-300 rounded-md p-8 text-gray-800'>This task has not been reported yet</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="report-to-task">
        <div className="report-data relative">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500" onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <div className="report-content p-8">
                <div className="text mb-6 border-b border-gray-300 pb-3">
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

                <div className="report-details max-h-[520px] overflow-y-scroll scrollbar-hide grid grid-cols-1 gap-6">
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
                    <div className="box-input p-4 border border-gray-200 rounded-md bg-transparent">
                        <h3 className="text-sm font-semibold mb-1">Problems encountered/difficulties:</h3>
                        <p className="text-sm">{reportData.issues}</p>
                    </div>
                </div>
            </div>

        </div>
    </section>

    );
};

export default ShowReportToTask;
