import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReportComment = ({ taskId, auth, is_project_manager }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showScrollButton, setShowScrollButton] = useState(false); // Trạng thái để hiển thị nút cuộn xuống
    const commentsEndRef = useRef(null); // Tạo ref cho phần tử cuối cùng của danh sách bình luận
    const commentsContainerRef = useRef(null); // ref cho container của danh sách bình luận

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

    useEffect(() => {
        // Cuộn xuống bình luận cuối cùng mỗi khi `comments` thay đổi
        scrollToBottom();
    }, [comments]);

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Hàm để kiểm tra khi người dùng cuộn
    useEffect(() => {
        const handleScroll = () => {
            if (commentsContainerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = commentsContainerRef.current;
                // Kiểm tra nếu người dùng không ở cuối danh sách, hiển thị nút cuộn xuống
                if (scrollHeight - scrollTop > clientHeight + 50) {
                    setShowScrollButton(true);
                } else {
                    setShowScrollButton(false);
                }
            }
        };

        commentsContainerRef.current?.addEventListener('scroll', handleScroll);

        return () => {
            commentsContainerRef.current?.removeEventListener('scroll', handleScroll);
        };
    }, []);

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
            <div 
                ref={commentsContainerRef} 
                className="custom-comment w-full rounded-md space-y-4 p-4 overflow-y-auto max-h-[320px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-hide"
            >
                {comments && comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div 
                            key={index} 
                            className={`box-comment ${comment.is_project_manager ? "manager" : "staff"} relative flex flex-col w-auto items-start gap-3 shadow-md p-3 rounded-md`}
                        >
                            <div className='flex w-full justify-start items-center gap-2'>
                                <img 
                                    // src={comment.user.profile_picture} 
                                    src='/image/y.jpg'
                                    alt="User avatar" 
                                    className="w-8 h-8 rounded-full border border-gray-500"
                                />
                                <p className="text-sm font-semibold">{comment.user ? comment.user.name : 'Unknown User'}</p>
                            </div>
                            <div className="manager w-[90%] py- rounded-bl-xl rounded-e-xl">
                                <p className="text-sm break-words whitespace-normal">{comment.comment}</p>
                            </div>
                            <span className="text-[10px] font-extralight">{formatDate(comment.created_at)}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">Chưa có bình luận nào.</p>
                )}
                <div ref={commentsEndRef} /> {/* ref để đánh dấu vị trí kết thúc danh sách bình luận */}
            </div>

            

            {/* New Comment Input */}
            <div className="mt-4 px-4 flex items-center gap-3 relative">
                {/* Nút cuộn xuống bình luận cuối cùng */}
                {showScrollButton && (
                    <button 
                        onClick={scrollToBottom} 
                        className=" absolute right-4 -top-14 p-1 rounded-full btn-scroll"
                    >
                        <svg className='font-black' xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor"><path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z"/></svg>
                    </button>
                )}
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
                    Send
                </button>
            </div>
        </div>
    );
};

export default ReportComment;
