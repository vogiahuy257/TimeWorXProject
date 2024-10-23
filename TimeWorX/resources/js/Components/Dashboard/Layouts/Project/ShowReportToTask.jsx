import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ShowReportToTask = ({ task, onClose }) => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Lấy dữ liệu báo cáo khi component được mount
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
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!reportData) {
        return <div>No report found for this task</div>;
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
                        <h3 className="text-sm font-semibold mb-1">Problems encountered/difficulties:</h3>
                        <p className="text-sm">{reportData.issues}</p>
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
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                                            viewBox="0 0 20 20" 
                                            fill="currentColor"
                                        >
                                            <path 
                                                fillRule="evenodd" 
                                                d="M10 14a1 1 0 01-1-1V4a1 1 0 112 0v9a1 1 0 01-1 1z" 
                                                clipRule="evenodd" 
                                            />
                                            <path d="M5 10a1 1 0 000 2h10a1 1 0 000-2H5z" />
                                            <path d="M10 18a7 7 0 100-14 7 7 0 000 14zm0 2a9 9 0 110-18 9 9 0 010 18z" />
                                        </svg>
                                    </a>
                                </p>
                                ) : null
                            ))
                        )}
                    </div>
                </div>
            </div>

        </div>
    </section>

    );
};

export default ShowReportToTask;
