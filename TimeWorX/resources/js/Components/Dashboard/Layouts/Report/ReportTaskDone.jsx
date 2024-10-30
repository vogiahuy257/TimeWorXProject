import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const ReportTaskDone = ({ project_id }) => {
    const [taskData, setTaskData] = useState([]); 

    const fetchChartData = async () => {
        try {
            const response = await axios.get(`/api/tasks/${project_id}/done`);
            const data = response.data;
            setTaskData(data);
            console.log(data);
        } catch (error) {
            toast.error("Failed to fetch project tasks.");
        }
    };

    useEffect(() => {
        fetchChartData();
    }, [project_id]);

    return (
        <section className="report-task-done w-full h-full mx-auto mt-6">
            <div className="overflow-y-auto max-h-80 scrollbar-hide">
                {taskData.length > 0 ? (
                    taskData.map((task) => (
                        <div
                            key={task.task_id} 
                            className="task-done-box text-left p-2 m-2 rounded-md relative"
                        >
                            <h3 className="text-sm font-semibold">{task.task_name}</h3>
                            <p className="text-xs text-gray-500">{task.task_description || "No description"}</p>
                            <button className="btn-report p-4 absolute top-1/2 right-0 -translate-y-1/2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.6998 21.6001H5.69979C4.37431 21.6001 3.2998 20.5256 3.2998 19.2001L3.2999 4.80013C3.29991 3.47466 4.37442 2.40015 5.6999 2.40015H16.5002C17.8256 2.40015 18.9002 3.47466 18.9002 4.80015V9.60015M7.50018 7.20015H14.7002M7.50018 10.8001H14.7002M14.7002 15.5541V18.4985C14.7002 19.9534 16.2516 21.2879 17.7065 21.2879C19.1615 21.2879 20.7002 19.9535 20.7002 18.4985V14.7793C20.7002 14.009 20.2574 13.2273 19.2723 13.2273C18.2186 13.2273 17.7065 14.009 17.7065 14.7793V18.3435M7.50018 14.4001H11.1002" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">No completed tasks found for this project.</p>
                )}
            </div>
        </section>
    );
};

export default ReportTaskDone;
