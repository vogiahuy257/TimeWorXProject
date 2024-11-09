// Comments.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReportComment = ({ taskId, auth ,is_project_manager }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const fetchComments = () => {
        axios.get(`/api/reports/${taskId}/comments/${auth.user.id}`)
            .then((response) => {
                setComments(response.data);
            })
            .catch(() => {
                console.error('Failed to load comments');
            });
    };

    useEffect(() => {
        fetchComments();
    }, [taskId]);

    const handleSendComment = () => {
        if (newComment.trim() === '') return;

        axios.post(`/api/reports/${taskId}/comments/${auth.user.id}`, { comment: newComment, is_project_manager: is_project_manager })
            .then(() => {
                setNewComment('');
                fetchComments();
            })
            .catch(() => {
                toast.error('Failed to add comment');
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    return (
            <div id='report-comment'>
                <h2 className="text-lg font-semibold mb-2 ml-2">Comments</h2>
                        
                            {/* Example comment from a manager */}
                            <div className="custom-comment w-full rounded-md space-y-4 p-4 overflow-y-auto max-h-[320px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-hide">
                            {comments && comments.length > 0 ? (
                                comments.map((comment,index) => (
                                    <div key={index} className={`box-comment ${comment.is_project_manager ? "manager" : "staff"} relative flex flex-col w-auto items-start gap-3 shadow-md p-3 rounded-md`}>
                                        <div className='flex w-full justify-start items-center gap-2'>
                                            <img 
                                                // src={comment.user.profile_picture} 
                                                src='/image/y.jpg'
                                                alt="User avatar" 
                                                className="w-8 h-8 rounded-full border border-gray-500"
                                            />
                                            <p className="text-sm font-semibold">{comment.user ? comment.user.name : 'Unknown User'}</p>
                                        </div>
                                        <div className="manager w-[90%] py-2 rounded-bl-xl rounded-e-xl">
                                            <p className="text-sm break-words whitespace-normal">{comment.comment}</p>
                                        </div>
                                        <span className="text-[10px] font-extralight">{formatDate(comment.created_at)}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">Chưa có bình luận nào.</p>
                            )}

                            </div>

                       {/* New Comment Input */}
                        <div className="mt-4 px-4 flex items-center gap-3">
                            <textarea 
                                className="flex-1 custom-textarea border-gray-300 p-2 rounded-lg resize-none" 
                                rows="1" 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                            ></textarea>
                            <button 
                                onClick={handleSendComment}
                                className="btn-send text-white px-4 py-1.5 rounded-lg"
                            >
                                send
                            </button>
                        </div>
            </div>
    );
};

export default ReportComment;
