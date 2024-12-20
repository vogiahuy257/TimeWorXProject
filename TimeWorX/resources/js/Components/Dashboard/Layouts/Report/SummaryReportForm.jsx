import React, { useState,useRef,useEffect } from 'react';
import FileSelection from './ComponentsSummaryReportForm/FileSelection';
import Dropdown from './ComponentsSummaryReportForm/Dropdown';
import './css/SummaryReportForm.css';

export default function SummaryReportForm({ auth, handleOpenForm,projectIdChange }) {
    // Khai báo các state cho các trường trong form
    const [reportName, setReportName] = useState('');
    const [project, setProject] = useState('');
    const [projects, setProjects] = useState([]);
    const [reportDate, setReportDate] = useState('');
    const [summary, setSummary] = useState('');
    const [completedTasks, setCompletedTasks] = useState('');
    const [upcomingTasks, setUpcomingTasks] = useState('');
    const [projectIssues, setProjectIssues] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]); // Dùng mảng để lưu tệp được chọn

    const [isAtBottom, setIsAtBottom] = useState(true); // Trạng thái nút cuộn
    const formRef = useRef(null);

      // Handle input changes
      const handleReportNameChange = (e) => setReportName(e.target.value);
      const handleProjectChange = (projectId) => setProject(projectId);
      const handleReportDateChange = (e) => setReportDate(e.target.value);
      const handleSummaryChange = (e) => setSummary(e.target.value);
      const handleCompletedTasksChange = (e) => setCompletedTasks(e.target.value);
      const handleUpcomingTasksChange = (e) => setUpcomingTasks(e.target.value);
      const handleProjectIssuesChange = (e) => setProjectIssues(e.target.value);
  
      // Handle file selection change
      const handleFileSelectionChange = (e) => {
        const { value, checked } = e.target;
        setSelectedFiles((prevState) =>
          checked
            ? [...prevState, value] // Add the file if checked
            : prevState.filter((file) => file !== value) // Remove the file if unchecked
        );
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

        console.log('Form Data:', JSON.stringify(formData, null, 2));

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

    // Hàm gọi API lấy danh sách project
    const fetchProjects = async () => {
        try {
            const response = await axios.get(`/api/projects/${auth.user.id}`);
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    // Gọi API khi component được render
    useEffect(() => {
        fetchProjects();
        setProject(projectIdChange);    
    }, []);

    return (
        <section id='SummaryReportForm' className='fixed top-0 left-0 w-full h-full z-50'>
            <div className='custom-form rounded-lg shadow-xl w-full max-w-2xl'>
                <div className="relative p-4">
                    
                    <h2 className="text-2xl font-semibold">Summary Report</h2>
                    <p className=" mb-2 text-sm font-light">Create a new summary report for your project</p>

                    <button
                        onClick={handleOpenForm}
                        className="absolute right-4 top-4 btn-close"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                            <path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/>
                        </svg>
                    </button>

                    <form ref={formRef} className="custom-form-main rounded-md max-h-[70vh] p-4 pt-2 overflow-y-auto scrollbar-hide w-full">
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
                                onChange={handleReportNameChange}
                                placeholder="Enter report name"
                            />
                        </div>

                        {/* Project Select */}
                        <Dropdown
                            label="Select a Project"
                            options={projects}
                            value={project}
                            onChange={handleProjectChange}
                        />

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
                                onChange={handleReportDateChange}
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
                                onChange={handleSummaryChange}
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
                                onChange={handleCompletedTasksChange}
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
                                onChange={handleUpcomingTasksChange}
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
                                onChange={handleProjectIssuesChange}
                                placeholder="Describe any project issues"
                            ></textarea>
                        </div>
                        {/* File Selection */}
                        <FileSelection
                            files={[
                                { id: "overview", label: "Project_Overview.docx", taskName: "task1", type: 'docx' },
                                { id: "budget", label: "Budget_Report.xlsx", taskName: "task1", type: 'xlsx' },
                                { id: "team", label: "Team_Photo.jpg", taskName: "task1", type: 'jpg' },
                                { id: "feedback", label: "Client_Feedback.pdf", taskName: "task1", type: 'pdf' },
                                { id: "timeline", label: "Timeline.xlsx", type: 'xlsx' },
                                { id: "design", label: "Design_Mockup.png", taskName: "task1", type: 'png' }
                            ]}
                            selectedFiles={selectedFiles}
                            onChange={handleFileSelectionChange}
                        />

                        {/* Nút cuộn xuống */}
                        {!isAtBottom && (
                            <button
                                type="button"
                                onClick={scrollToBottom}
                                className="absolute btn-scroll bottom-20 right-[50%] translate-x-1/2 p-2 rounded-full shadow-xl"
                                aria-label="Scroll to bottom"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </button>
                        )}
                    </form>
                    
                    <div className='relative pt-3'>
                        <span 
                            className='custom-selectedFiles text-center flex justify-end items-end text-sm absolute right-0 -top-[35px]'
                        >
                            <p className='text-center flex justify-center items-center rounded-md'>{selectedFiles.length} files selected</p>
                        </span>
                        <button
                            onClick={handleSubmit}
                            type="submit"
                            className="w-full text-sm btn-submit py-2 px-4 rounded-md"
                            >
                            Create Report Summary
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
