import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReportPieChart from './ReportPieChart';

const ReportProjectDetail = ({ project ,user_id}) => {

    const [pieChartDataValues, setPieChartDataValues] = useState([0, 0, 0, 0]); // Khởi tạo dữ liệu biểu đồ
    const pieChartLabels = ["To Do", "In-Progress", "Verify"];
    const pieChartColors = ["#117add", "#f1c21b", "#da1e28"];

    const fetchChartData = async () => {
        try {
            const response = await axios.post(`/api/projects/${project.project_id}/statistics`, {
                user_id: user_id 
            });
            const data = response.data.statistics;
            setPieChartDataValues([
                data['to-do'] || 0,
                data['in-progress'] || 0,
                data['verify'] || 0,
            ]);
            console.log(pieChartDataValues);
        } catch (error) {
            toast.error("Failed to fetch project statistics.");
        }
    };

    useEffect(() => {
        fetchChartData();
    }, [project.project_id, user_id]);

    const formatDateRange = (startDate, endDate) => {
        const optionsWithYear = { day: '2-digit', month: 'short', year: 'numeric' };
        const optionsWithoutYear = { day: '2-digit', month: 'short' };
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (start.getFullYear() === end.getFullYear()) {
            const formattedStart = start.toLocaleDateString('en-GB', optionsWithoutYear);
            const formattedEnd = end.toLocaleDateString('en-GB', optionsWithYear); 
            return `${formattedStart} - ${formattedEnd}`;
        } else {
            const formattedStart = start.toLocaleDateString('en-GB', optionsWithYear);
            const formattedEnd = end.toLocaleDateString('en-GB', optionsWithYear);
            return `${formattedStart} - ${formattedEnd}`;
        }
    };

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
        <div className="project-detail">
            <h3 className="project-name shadow-md px-2 py-2 text-center break-words whitespace-normal">Your Project</h3>
            <h3 className="project-date rounded-lg py-1 text-center break-words whitespace-normal">{formatDateRange(project.start_date,project.end_date)}</h3>
            <div className='detail-content p-4 rounded-lg shadow-md flex'>
                <div className='w-1/2 overflow-y-auto scrollbar-hide'>
                    <h3 className='text-sm font-sans font-bold'>Project Name:</h3>
                        <p className='text-xs mt-1 break-words whitespace-normal overflow-hidden'>{project.project_name}</p>
                    <h3 className='text-sm font-sans font-bold'>Description:</h3>
                        <p className='text-xs mt-1 break-words whitespace-normal overflow-hidden'>{project.project_description}</p>
                    <h3 className='text-sm font-sans font-bold'>Status:</h3>
                        <p className='text-xs mt-1 break-words whitespace-normal overflow-hidden'>{project.project_status}</p>
                    <h3 className='text-sm font-sans font-bold'>Created at:</h3>
                        <p className='text-xs mt-1 break-words whitespace-normal overflow-hidden'>{formatDate(project.created_at)}</p>
                </div>
                <div className='w-1/2 overflow-hidden flex items-center justify-center'>
                
                {project.project_status == "done" ? 
                (
                    <div className='flex flex-col justify-center items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="64px"  width="64px" viewBox="0 -960 960 960" fill="#25a249"><path d="m424-408-86-86q-11-11-28-11t-28 11q-11 11-11 28t11 28l114 114q12 12 28 12t28-12l226-226q11-11 11-28t-11-28q-11-11-28-11t-28 11L424-408Zm56 328q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                        <h3 className='text-green-600'>Done</h3>
                    </div>
                ):
                (
                    <ReportPieChart 
                    labels={pieChartLabels} 
                    dataValues={pieChartDataValues} 
                    colors={pieChartColors} 
                    title="Task Completion Status" 
                    /> 
                )}
                    
                </div>
            </div>
        </div>
    );
};

export default ReportProjectDetail;
