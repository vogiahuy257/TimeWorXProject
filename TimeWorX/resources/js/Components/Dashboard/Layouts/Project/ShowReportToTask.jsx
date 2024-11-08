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

    // if (loading) {
    //     return <section id="report-to-task">
    //     <div className="report-data m-auto h-full w-full max-w-[1000px] relative rounded-md ">
    //         <button className="absolute btn-close z-50 top-4 right-4 p-1 rounded-md" onClick={onClose}>
    //             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                 <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    //                 <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    //             </svg>
    //         </button>
    //         <div className='m-auto p-4 w-full h-full relative flex flex-col-reverse scrollbar-hide justify-center items-center gap-4 overflow-y-auto  md:flex-row'>
    //             <div className='w-4/5 h-full report-content p-8 md:w-2/3'>
    //                 <div className="report-content report-task-form p-8">
    //                     <div className="text-base text-center text-gray-800">Loading...</div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // </section>;
    // }

    // if (!reportData || !reportData.user) {
    //     return (
    //         <section id="report-to-task">
    //             <div className="report-data m-auto h-full w-full max-w-[1000px] relative rounded-md ">
    //                 <button className="absolute btn-close z-50 top-4 right-4 p-1 rounded-md" onClick={onClose}>
    //                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                         <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    //                         <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    //                     </svg>
    //                 </button>
    //                 <div className='m-auto p-4 w-full h-full relative flex flex-col-reverse scrollbar-hide justify-center items-center gap-4 overflow-y-auto  md:flex-row'>
    //                     <div className='w-4/5 flex justify-center items-center h-full report-content p-8 md:w-2/3'>
    //                         <div className='m-auto flex justify-center items-center'>
    //                             <p className='text-center bg-gray-300 rounded-md p-8 text-gray-800'>This task has not been reported yet</p>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </section>
    //     );
    // }

    return (
        <section id="report-to-task" className='flex'>
        <div className="report-data h-auto m-auto scrollbar-hide relative w-full max-w-[880px] max-h-full p-4 overflow-y-auto rounded-lg shadow-lg">
            <button className=" absolute btn-close z-50 top-4 right-4 p-1.5 rounded-xl" onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

        <div className='flex flex-col items-center w-full gap-4 overflow-y-auto'>
            
            <div className="report-content w-[88%] p-8 rounded-lg shadow">
            {reportData && reportData.user ?
            (
                <>
                    <div className="text mb-4 border-b border-gray-300 pb-3">
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
                </>
            ):(
                <>
                <p className="text-center bg-gray-300 rounded-md p-8 text-gray-800">This task has not been reported yet</p>
                </>
            )}
            </div>
            

                <div className='w-[90%] report-content h-auto bg-gray-100 p-4 rounded-lg shadow-md'>
                    <h2 className="text-lg font-semibold mb-2">Comments</h2>
                        {/* Display existing comments */}
                        <div className="space-y-4 overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-300">
                            {/* Example comment from a manager */}
                            <div className="flex items-start gap-3">
                                <img 
                                    src="manager-avatar.jpg" 
                                    alt="Manager avatar" 
                                    className="w-8 h-8 rounded-full border border-blue-500"
                                />
                                <div className="bg-blue-100 p-3 rounded-lg flex-1">
                                    <p className="text-xs text-blue-600 font-semibold">Manager</p>
                                    <p className="text-sm text-gray-800">Good progress so far, please keep us updated on any challenges.</p>
                                    <span className="text-xs text-gray-400">2 hours ago</span>
                                </div>
                            </div>

                            {/* Example comment from a staff member */}
                            <div className="flex items-start gap-3">
                                <img 
                                    src="staff-avatar.jpg" 
                                    alt="Staff avatar" 
                                    className="w-8 h-8 rounded-full border border-gray-500"
                                />
                                <div className="bg-gray-50 p-3 rounded-lg flex-1">
                                    <p className="text-xs text-gray-600 font-semibold">Staff</p>
                                    <p className="text-sm text-gray-800">I will update the report once the task progresses further.</p>
                                    <span className="text-xs text-gray-400">1 hour ago</span>
                                </div>
                            </div>
                        </div>

                        {/* Comment input box */}
                        <div className="mt-4 flex items-center gap-3">
                            <img 
                                src="user-avatar.jpg" 
                                alt="User avatar" 
                                className="w-8 h-8 rounded-full border border-gray-500"
                            />
                            <textarea 
                                className="flex-1 custom-textarea border-gray-300 p-2 rounded-lg resize-none focus:outline-none focus:ring focus:border-blue-300" 
                                rows="1" 
                                placeholder="Write a comment..."
                            ></textarea>
                            <button 
                                className="btn-send text-white px-4 py-1.5 rounded-lg transition-colors duration-300"
                            >
                                Send
                            </button>
                        </div>

                </div>
                
            </div>
        </div>
    </section>

    );
};

export default ShowReportToTask;
