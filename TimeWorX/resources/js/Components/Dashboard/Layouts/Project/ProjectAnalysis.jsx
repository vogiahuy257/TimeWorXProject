import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CardProjectAnalysis from './analysis/CardProjectAnalysis';
import DashBoardProjectAnalysis from './analysis/DashBoardProjectAnalysis';

export default function ProjectAnalysis({ userId, onClose }) {

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectProject, setSelectProject] = useState("");
    const [isOpenProjectAnalysis, setIsOpenProjectAnalysis] = useState(false);

    const onClickProjectAnalysis = (project_id) => {
        setSelectProject(project_id);
        setIsOpenProjectAnalysis(!isOpenProjectAnalysis);
    };

    const fetchProjectStatistics = async () => {
        try {
            const response = await fetch(`/api/projects/statistics/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch project statistics');
            }
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            toast.error("Error loading project statistics");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectStatistics();
    }, [userId]);

    return (
        <section id='project-analysis'>
            <div className='main'>
                <button className='btn-close' onClick={onClose}>
                    <svg className='mx-auto' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
                    </svg>
                </button>

                <h1 className='text-xl custom-title'>Project Progress</h1>

                <section className='mt-8 space-y-4 max-h-[626px] overflow-y-auto overflow-x-hidden scrollbar-hide'>
                    {loading ? (
                        <p className=''>Loading...</p>
                    ) : isOpenProjectAnalysis ? 
                    (
                        <DashBoardProjectAnalysis project_id={selectProject} onClose={onClickProjectAnalysis}/>
                    ):
                    (
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-10'>
                            {projects.length > 0 ? (
                                projects.map((project) => (
                                    <button className='btn-card-analysis rounded-lg' onClick={onClickProjectAnalysis}>
                                        <div key={project.project_id} className="custom-card-analysis rounded-lg h-full flex flex-col">
                                            <CardProjectAnalysis 
                                                projectName={project.project_name}
                                                labels={["To-Do", "In-Progress", "Verify", "Done"]}
                                                dataValues={[
                                                    project.statistics['to-do'],
                                                    project.statistics['in-progress'],
                                                    project.statistics['verify'],
                                                    project.statistics['done']
                                                ]}
                                                colors={["#117add", "#f1c21b", "#da1e28", "#25a249"]}
                                            />
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <p className='text-gray-500'>No projects found.</p>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </section>
    );
}