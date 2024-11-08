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
            const sortedData = data.sort((a, b) => {
                if (a.status_key === "verify" && b.status_key !== "verify") return -1;
                if (a.status_key !== "verify" && b.status_key === "verify") return 1;
                return 0;
            });
            setTaskData(sortedData);
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
        <section className="custom-task-done w-full h-full mx-auto shadow-md rounded-md p-2 py-4">
             <div className="select-task-done">
                <select 
                    id="endDate" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    className='p-1'
                >
                    <option value="all">All</option>
                    {dateOptions.map((date) => (
                        <option key={date} value={date}>
                            {formatDateToDMY(date)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-wrap gap-4 p-2 mx-auto mt-4 w-auto rounded max-h-[290px] overflow-y-auto scrollbar-hide">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                            <button
                                key={task.task_id} 
                                onClick={() => onOpenReportTaskForm(task)} 
                                className="btn-report py-2 rounded-md relative flex flex-col justify-center items-center">

                                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className='icon-path1' opacity="0.4" d="M16.74 3.65002H8.26004C5.79004 3.65002 3.79004 5.66002 3.79004 8.12002V17.53C3.79004 19.99 5.80004 22 8.26004 22H16.73C19.2 22 21.2 19.99 21.2 17.53V8.12002C21.21 5.65002 19.2 3.65002 16.74 3.65002Z" fill="currentColor"/>
                                    <path className='icon-path2' d="M14.85 2H10.15C9.11001 2 8.26001 2.84 8.26001 3.88V4.82C8.26001 5.86 9.10001 6.7 10.14 6.7H14.85C15.89 6.7 16.73 5.86 16.73 4.82V3.88C16.74 2.84 15.89 2 14.85 2Z" fill="currentColor"/>
                                    <path  d="M15.5 12.95H8.5C8.09 12.95 7.75 12.61 7.75 12.2C7.75 11.79 8.09 11.45 8.5 11.45H15.5C15.91 11.45 16.25 11.79 16.25 12.2C16.25 12.61 15.91 12.95 15.5 12.95Z" fill="currentColor"/>
                                    <path  d="M12.88 16.95H8.5C8.09 16.95 7.75 16.61 7.75 16.2C7.75 15.79 8.09 15.45 8.5 15.45H12.88C13.29 15.45 13.63 15.79 13.63 16.2C13.63 16.61 13.29 16.95 12.88 16.95Z" fill="currentColor"/>
                                </svg>

                                <h3 className="w-5/6 break-words whitespace-nowrap overflow-hidden text-ellipsis truncate">{task.task_name}</h3>
                            </button>
                            
                    ))
                ) : (
                    <p className="text-gray-600 text-center">No completed tasks found for this project.</p>
                )}
            </div>
            
        </section>
    );
};

export default ReportTaskDone;
