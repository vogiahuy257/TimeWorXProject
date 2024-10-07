import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import PrimaryButton from '@/Components/PrimaryButton';
import TextareaAutosize from 'react-textarea-autosize';
import './css/TaskComments.css';

const TaskComments = ({ taskId, onClose,isManagerComment }) => {
    const [commentsData, setCommentsData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [commentContent, setCommentContent] = useState('');

    const formatDate = (dateString) => {
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        };
        
        return new Date(dateString).toLocaleString('en-GB', options).replace(',', '');
    };

     const fetchComments = async () => {
        try {
            const response = await axios.get(`/api/tasks/${taskId}/comments`);
            setCommentsData(response.data);
            if (response.data.length > 0) {
                setSelectedUser(response.data[0].user); 
            }
        } catch (error) {
            toast.error('Failed to fetch comments');
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();

        if (!commentContent.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        const formattedComment = commentContent.replace(/\n/g, '<br />');
    
        try {
            const response = await axios.post('/api/task-comments', {
                task_id: taskId,
                user_id: selectedUser.id,  
                comment_text: formattedComment,
                is_manager_comment: isManagerComment 
            });
    
            setCommentsData((prevData) =>
                prevData.map(data =>
                    data.user.id === selectedUser.id
                        ? { ...data, comments: [...data.comments, response.data] }
                        : data
                )
            );
    
            setCommentContent(''); 
        } catch (error) {
            toast.error('Failed to add comment');
        }
    };

    useEffect(() => {
        fetchComments();
    }, [taskId]);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    return (
        <section className='task-comments'>
        <div className="task-comments-main">

            {/* menu-left */}
            <div className="task-comments-menu">
                {/* button close and Task Name */}
                <div className='task-header'>
                    <PrimaryButton className='btn-close' onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 17L10 12L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </PrimaryButton>
                    <h1> Task Name </h1>
                </div>
                {/* user list */}
                <div className="comments-user-list">
                    <ul>
                    {isManagerComment ? (
                        commentsData.map((data, index) => (
                            <li
                                key={data.user.id}
                                className={selectedUser && selectedUser.id === data.user.id ? 'active' : ''}
                                onClick={() => handleUserSelect(data.user)}
                            >
                                <img src="/image/y.jpg" alt="" />
                                <p>{data.user.name}</p>
                            </li>
                        ))
                    ) : (
                        <li>
                            <img className='active' src="/image/boss.jpg" alt="" />
                            <p>Boss</p>
                        </li> 
                    )}
                    </ul>
                </div>
            </div>

            {/* content */}
            <div className='task-comments-content'>

            {selectedUser && (
                        <>
                            {/* logo user */}
                            <div className="task-comments-header">
                                <img src={isManagerComment ? '/image/y.jpg' : '/image/boss.jpg'} alt="" />
                                <h1>{isManagerComment ? (selectedUser.name) : ("Boss")}</h1>
                            </div>

                            {/* list comments */}
                            <section className="task-comments-list">
                                {commentsData
                                    .find((data) => data.user.id === selectedUser.id)
                                    ?.comments.map((comment) => (
                                        <div
                                            key={comment.comment_id}
                                            className={`comments ${comment.is_manager_comment ? 'comments-left' : 'user-comments'}`}
                                        >
                                            <div className='comments-content'>
                                                <p className="comments-text"dangerouslySetInnerHTML={{ __html: comment.comment_text }}/>
                                                <p className='comments-date'>{formatDate(comment.created_at)}</p>
                                            </div>
                                        </div>
                                    ))}
                            </section>

                            {/* Post comment */}
                            <div className='task-comments-post'>
                                <form onSubmit={handleAddComment}>
                                    <TextareaAutosize
                                        minRows={1}
                                        maxRows={3}
                                        className='custom-textArea'
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                    />
                                    <PrimaryButton type="submit" className='btn'>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21.0704 2.92949L10.4064 13.5935M3.27109 8.23517L19.877 2.47394C20.8996 2.11915 21.8807 3.10028 21.526 4.12291L15.7647 20.7288C15.37 21.8664 13.7726 21.8976 13.3338 20.7763L10.6969 14.0375C10.5652 13.701 10.2989 13.4347 9.96235 13.303L3.22363 10.6661C2.10229 10.2273 2.13348 8.62985 3.27109 8.23517Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                    </PrimaryButton>
                                </form>
                            </div>
                        </>
                    )}
            </div>
        </div>
        </section>
    );
};

export default TaskComments;
