import React, { useState,useRef,useEffect } from 'react';
import './css/SummaryReportForm.css';

export default function SummaryReportForm({ auth, handleOpenForm }) {
    // Khai báo các state cho các trường trong form
    const [reportName, setReportName] = useState('');
    const [project, setProject] = useState('');
    const [reportDate, setReportDate] = useState('');
    const [summary, setSummary] = useState('');
    const [completedTasks, setCompletedTasks] = useState('');
    const [upcomingTasks, setUpcomingTasks] = useState('');
    const [projectIssues, setProjectIssues] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]); // Dùng mảng để lưu tệp được chọn

    const [isAtBottom, setIsAtBottom] = useState(true); // Trạng thái nút cuộn
    const formRef = useRef(null);

    // Hàm xử lý thay đổi khi người dùng nhập liệu
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setSelectedFiles((prevState) =>
                checked ? [...prevState, value] : prevState.filter((file) => file !== value)
            );
        } else {
            // Cập nhật trực tiếp giá trị của các state
            if (name === 'reportName') setReportName(value);
            if (name === 'project') setProject(value);
            if (name === 'reportDate') setReportDate(value);
            if (name === 'summary') setSummary(value);
            if (name === 'completedTasks') setCompletedTasks(value);
            if (name === 'upcomingTasks') setUpcomingTasks(value);
            if (name === 'projectIssues') setProjectIssues(value);
        }
    };

    // Hàm gửi form
    const handleSubmit = async (e) => {
        e.preventDefault();
        

        // Dữ liệu form sẽ được gửi dưới dạng JSON
        const formData = {
            reportName,
            project,
            reportDate,
            summary,
            completedTasks,
            upcomingTasks,
            projectIssues,
            selectedFiles,
        };

        console.log(`submit: ${formData.reportName}`);
        // try {
        //     const response = await fetch('/api/submit-report', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${auth}`, // Nếu bạn cần gửi token
        //         },
        //         body: JSON.stringify(formData),
        //     });

        //     if (response.ok) {
        //         const result = await response.json();
        //         console.log('Form submitted successfully:', result);
        //         // Xử lý sau khi gửi thành công, ví dụ: thông báo, đóng form, v.v.
        //     } else {
        //         console.error('Error submitting form:', response.status);
        //         // Xử lý lỗi gửi form
        //     }
        // } catch (error) {
        //     console.error('An error occurred:', error);
        // }
    };

    // Hàm kiểm tra xem đã cuộn đến cuối chưa
    const handleScroll = () => {
        if (formRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = formRef.current;
            const atBottom = scrollTop + clientHeight >= scrollHeight - 5; // Kiểm tra vị trí
            setIsAtBottom(atBottom);
        }
    };

    // Hàm cuộn đến cuối form khi bấm nút
    const scrollToBottom = () => {
        if (formRef.current) {
          formRef.current.scrollTo({
            top: formRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      };

        // Lắng nghe sự kiện cuộn
        useEffect(() => {
            const currentForm = formRef.current;
        
            // Kiểm tra vị trí cuộn ngay khi form render
            if (currentForm) {
                const { scrollTop, scrollHeight, clientHeight } = currentForm;
                const atBottom = scrollTop + clientHeight >= scrollHeight - 5; // Kiểm tra vị trí
                setIsAtBottom(atBottom);
        
                // Lắng nghe sự kiện cuộn
                currentForm.addEventListener('scroll', handleScroll);
            }
        
            return () => {
                if (currentForm) {
                    currentForm.removeEventListener('scroll', handleScroll);
                }
            };
        }, []);
    

    return (
        <section id='SummaryReportForm' className='fixed top-0 left-0 w-full h-full z-50'>
            <div className='custom-form rounded-lg shadow-xl w-full max-w-2xl'>
                <div className="relative p-4">
                    
                    <h2 className="text-2xl font-semibold mb-1">Summary Report</h2>
                    <p className=" mb-3 text-gray-600">Create a new summary report for your project</p>

                    <button
                        onClick={handleOpenForm}
                        className="absolute right-4 top-4 btn-close"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                            <path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/>
                        </svg>
                    </button>

                    <form ref={formRef} className="space-y-4 max-h-[70vh]  px-1 overflow-y-auto scrollbar-hide w-full mb-4">
                         {/* Report Name */}
                         <div>
                            <label htmlFor="reportName" className="text-sm font-medium mb-1">
                                Report Name
                            </label>
                            <input
                                type="text"
                                id="reportName"
                                name="reportName"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={reportName}
                                onChange={handleChange}
                                placeholder="Enter report name"
                            />
                        </div>

                        {/* Project Select */}
                        <div>
                            <label htmlFor="project" className=" text-sm font-medium mb-1">
                                Project
                            </label>
                            <select
                                id="project"
                                name="project"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={project}
                                onChange={handleChange}
                            >
                                <option value="">Select a project</option>
                                <option value="project1">Project 1</option>
                                <option value="project2">Project 2</option>
                                <option value="project3">Project 3</option>
                            </select>
                        </div>

                        {/* Report Date */}
                        <div>
                            <label htmlFor="reportDate" className="text-sm font-medium mb-1">
                                Report Date
                            </label>
                            <input
                                type="date"
                                id="reportDate"
                                name="reportDate"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={reportDate}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Summary */}
                        <div>
                            <label htmlFor="summary" className="text-sm font-medium mb-1">
                                Summary
                            </label>
                            <textarea
                                id="summary"
                                name="summary"
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={summary}
                                onChange={handleChange}
                                placeholder="Provide a brief summary of the report"
                            ></textarea>
                        </div>

                        {/* Completed Tasks */}
                        <div>
                            <label htmlFor="completedTasks" className="text-sm font-medium  mb-1">
                                Completed Tasks
                            </label>
                            <textarea
                                id="completedTasks"
                                name="completedTasks"
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={completedTasks}
                                onChange={handleChange}
                                placeholder="List completed tasks"
                            ></textarea>
                        </div>

                        {/* Upcoming Tasks */}
                        <div>
                            <label htmlFor="upcomingTasks" className="text-sm font-medium mb-1">
                                Upcoming Tasks
                            </label>
                            <textarea
                                id="upcomingTasks"
                                name="upcomingTasks"
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={upcomingTasks}
                                onChange={handleChange}
                                placeholder="List upcoming tasks"
                            ></textarea>
                        </div>

                        {/* Project Issues */}
                        <div>
                            <label htmlFor="projectIssues" className="text-sm font-medium mb-1">
                                Project Issues
                            </label>
                            <textarea
                                id="projectIssues"
                                name="projectIssues"
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={projectIssues}
                                onChange={handleChange}
                                placeholder="Describe any project issues"
                            ></textarea>
                        </div>
                        {/* File Selection */}
                        <div>
                            <span className="text-sm font-medium mb-2">
                                Select Files to Include in ZIP
                            </span>
                            <div className="space-y-4 p-2">
                                {[{ id: "overview", label: "Project_Overview.docx" }, { id: "budget", label: "Budget_Report.xlsx" }, { id: "team", label: "Team_Photo.jpg" }, { id: "feedback", label: "Client_Feedback.pdf" }, { id: "timeline", label: "Timeline.xlsx" }, { id: "design", label: "Design_Mockup.png" }].map((file) => (
                                    <div key={file.id} className="flex items-center rounded-md shadow-md p-4">
                                        <input
                                            type="checkbox"
                                            id={file.id}
                                            name="selectedFiles"
                                            value={file.id}
                                            className="h-4 w-4 custom-checkbox cursor-pointer text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor={file.id} className="ml-2 text-sm cursor-pointer">
                                            {file.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Nút cuộn xuống */}
                        {!isAtBottom && (
                            <button
                                type="button"
                                onClick={scrollToBottom}
                                className="absolute btn-scroll bottom-16 right-5 p-2 rounded-full shadow-xl"
                                aria-label="Scroll to bottom"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </button>
                        )}
                    </form>
                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className="w-full btn-submit py-1 px-3 rounded-md"
                        >
                        Submit
                    </button>
                </div>
            </div>
        </section>
    );
}
