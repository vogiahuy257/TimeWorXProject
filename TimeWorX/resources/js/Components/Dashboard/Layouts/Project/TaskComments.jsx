import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import PrimaryButton from '@/Components/PrimaryButton';
import './css/TaskComments.css';

const TaskComments = ({ taskId, onClose }) => {
    // giờ code giao diện cho form bình luận 
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');

    const fetchComments = async () => {

    };

    const handleAddComment = async () => {

    };

    useEffect(() => {
        fetchComments();
    }, [taskId]);

    return (
        <section className='task-comments'>
        <div className="task-comments-main">

            {/* menu-left */}
            <div className="task-comments-menu">
                <div className='task-header'>
                    <PrimaryButton className='btn-close' onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 17L10 12L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </PrimaryButton>
                    <h1> Task Name </h1>
                </div>
                <div className="comments-user-list">
                    <ul>
                        <li className='active'>
                            <img src="/image/y.jpg" alt="" />
                            <p>Username1</p>
                        </li>
                        <li>
                            <img src="/image/y.jpg" alt="" />
                            <p>Username2</p>
                        </li>
                        <li>
                            <img src="/image/y.jpg" alt="" />
                            <p>Username3</p>
                        </li>
                    </ul>
                </div>
            </div>

            {/* content */}
            <div className='task-comments-content'>

                <div className="task-comments-header">
                    <img src="/image/y.jpg" alt="" />
                    <h1>Username1</h1>
                </div>

                {/* list comments */}
                <div className="task-comments-list">
                    <div className='comments user-comments'>
                        <p className="comments-text">
                            Đây là bình luận của user
                        </p>
                        <p className='comments-date'>
                            03-10-2024 8:00pm
                        </p>
                    </div>
                    <div className='comments manager-comments'>
                        <p className="comments-text">
                            Đây là bình luận của manager
                        </p>
                        <p className='comments-date'>
                            03-10-2024 8:00pm
                        </p>
                    </div>
                </div>

                <div className='task-comments-post'>
                    <form action="">
                        <input className='input' type="text" />
                        <PrimaryButton type="submit" className='btn'>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.0704 2.92949L10.4064 13.5935M3.27109 8.23517L19.877 2.47394C20.8996 2.11915 21.8807 3.10028 21.526 4.12291L15.7647 20.7288C15.37 21.8664 13.7726 21.8976 13.3338 20.7763L10.6969 14.0375C10.5652 13.701 10.2989 13.4347 9.96235 13.303L3.22363 10.6661C2.10229 10.2273 2.13348 8.62985 3.27109 8.23517Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </PrimaryButton>
                    </form>
                </div>

            </div>
        </div>
        </section>
    );
};

export default TaskComments;
