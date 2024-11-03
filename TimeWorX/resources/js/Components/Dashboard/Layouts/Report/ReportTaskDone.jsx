import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';


const ReportTaskDone = ({ project_id ,onOpenReportTaskForm }) => {
    const [taskData, setTaskData] = useState([]); 
    const [endDate, setEndDate] = useState('all');
    const [dateOptions, setDateOptions] = useState([]);
   
    const fetchChartData = async () => {
        try {
            const response = await axios.get(`/api/tasks/${project_id}/done`);
            const data = response.data;
            setTaskData(data);
            const uniqueDates = new Set(data.map(task => new Date(task.updated_at).toISOString().split('T')[0]));
            setDateOptions(Array.from(uniqueDates));
        } catch (error) {
            toast.error("Failed to fetch project tasks.");
        }
    };

    useEffect(() => {
        fetchChartData();
    }, [project_id]);

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

    const formatDateToDMY = (dateString) => {
        const date = new Date(dateString);
        const options = { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
        };
        let formattedDate = date.toLocaleString('en-GB', options);
        formattedDate = formattedDate.replace(',', '').replace('/', '-').replace('/', '-');
        return formattedDate;
    };


    const handleFilter = () => {
        if (endDate === 'all') return taskData; // Nếu chọn "Tất cả", trả về tất cả nhiệm vụ

        const filteredTasks = taskData.filter(task => {
            const taskDate = new Date(task.updated_at).toISOString().split('T')[0];
            return taskDate === endDate; // Lọc nhiệm vụ có ngày cập nhật bằng ngày đã chọn
        });
        return filteredTasks;
    };

    const filteredTasks = handleFilter();

    return (
        <section className="custom-task-done w-full h-full mx-auto shadow-md p-2 py-4 mt-10">
             <div className="select-task-done">
                <select 
                    id="endDate" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    className='p-2'
                >
                    <option value="all">All</option>
                    {dateOptions.map((date) => (
                        <option key={date} value={date}>
                            {formatDateToDMY(date)}
                        </option>
                    ))}
                </select>
            </div>

            <div className='task-done-note'>
                {/* tùy thích chưa biết để gì vậy trong này!!! */}
            </div>

            <div className="overflow-y-auto max-h-56 scrollbar-hide rounded-md">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <div
                            key={task.task_id} 
                            className="task-done-box text-left p-3 my-2 rounded-md relative"
                        >
                            <div className='flex flex-col'>
                                <h3 className="text-sm font-semibold">{task.task_name}</h3>
                                <p className="text-xs">{formatDate(task.updated_at) || "N/A"}</p>
                            </div>
                            <p className="text-xs text-gray-500">{task.task_description || "No description"}</p>
                            <button onClick={() => onOpenReportTaskForm(task)} className="btn-report p-4 absolute top-1/2 right-1 -translate-y-1/2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.6998 21.6001H5.69979C4.37431 21.6001 3.2998 20.5256 3.2998 19.2001L3.2999 4.80013C3.29991 3.47466 4.37442 2.40015 5.6999 2.40015H16.5002C17.8256 2.40015 18.9002 3.47466 18.9002 4.80015V9.60015M7.50018 7.20015H14.7002M7.50018 10.8001H14.7002M14.7002 15.5541V18.4985C14.7002 19.9534 16.2516 21.2879 17.7065 21.2879C19.1615 21.2879 20.7002 19.9535 20.7002 18.4985V14.7793C20.7002 14.009 20.2574 13.2273 19.2723 13.2273C18.2186 13.2273 17.7065 14.009 17.7065 14.7793V18.3435M7.50018 14.4001H11.1002" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600 text-center">No completed tasks found for this project.</p>
                )}
            </div>
            
        </section>
    );
};

export default ReportTaskDone;
