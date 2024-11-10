import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReportComment = ({ taskId, auth, is_project_manager }) => {
    const [comments, setComments] = useState([]);
    const [pinnedComments, setPinnedComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isPinnedCollapsed, setIsPinnedCollapsed] = useState(true); // Trạng thái thu gọn bình luận ghim
    const [showScrollButton, setShowScrollButton] = useState(false); // Trạng thái để hiển thị nút cuộn xuống
    const commentsEndRef = useRef(null); // Tạo ref cho phần tử cuối cùng của danh sách bình luận
    const commentsContainerRef = useRef(null); // ref cho container của danh sách bình luận

    const fetchComments = () => {
        axios.get(`/api/reports/${taskId}/comments/${auth.user.id}`)
            .then((response) => {
                setComments(response.data.regular_comments);
                setPinnedComments(response.data.pinned_comments);
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
               console.error('Failed to add comment');
            });
    };

    //hàm thêm ghim
    const handlePinComment = (commentId) => {
        axios.post(`/api/reports/comments/${commentId}/pin`)
            .then(() => {
                fetchComments();
            })
            .catch(() => {
                console.error('Failed to pin the comment');
            });
    };

    //hàm tháo ghim
    const handlePinUnComment = (commentId) => {
        axios.post(`/api/reports/comments/${commentId}/unpin`)
            .then(() => {
                fetchComments();
            })
            .catch(() => {
                console.error('Failed to unpin the comment');
            });
    };
    
    //hàm xóa bình luận
    const handleDeleteComment = (commentId) => {
        axios.delete(`/api/reports/delete/${commentId}/${auth.user.id}`)
            .then(() => {
                fetchComments();
            })
            .catch(() => {
               console.error('Failed to delete comment');
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    return (
        <>
        {pinnedComments && pinnedComments.length > 0 && (
            <div id='pinned-box' className='rounded-md'>
                <div className='pinned-section pb-3 rounded-md max-h-[270px] scrollbar-hide overflow-y-auto '>
                    {pinnedComments.slice(0, isPinnedCollapsed ? 1 : pinnedComments.length).map((comment, index) => (
                        <div key={index} className="box-pin mt-6 mx-4 pinned-comment relative flex flex-col w-auto items-start gap-3 shadow-lg p-4 rounded-md">
                            <div className="flex w-full justify-start items-center gap-2">
                                <img src='/image/y.jpg' alt="User avatar" className="w-8 h-8 rounded-full border border-gray-500" />
                                <p className="text-sm font-semibold">{comment.user ? comment.user.name : 'Unknown User'}</p>
                            </div>
                            <div className="manager w-[90%] py- rounded-bl-xl rounded-e-xl">
                                <p className="text-sm break-words whitespace-normal">{comment.comment}</p>
                            </div>
                            <span className="text-[10px] font-extralight">{formatDate(comment.created_at)}</span>
                            
                            {comment.user.id === auth.user.id && (
                                <button onClick={() => handlePinUnComment(comment.comment_id)} className="btn-delete absolute top-[-12px] right-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="currentColor">
                                        <path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-330q0-17 11.5-28.5T400-720q17 0 28.5 11.5T440-680v330q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-350q0-17 11.5-28.5T680-720q17 0 28.5 11.5T720-680v350Z"/>
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))}
                    
                </div>
                {pinnedComments.length > 1 && (
                    <div className='w-full relative'>
                        {isPinnedCollapsed ? (
                            <p className='w-full text-center font-medium text-sm absolute animate-bounce -top-[38px]'>
                                See {pinnedComments.length - 1} Other Pins
                            </p>
                        ):null}
                        

                        <button onClick={() => setIsPinnedCollapsed(!isPinnedCollapsed)} className={`btn-show-pin m-auto text-sm`}>
                            <svg className={` ${isPinnedCollapsed ?  null: "isshow"}`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-361q-8 0-15-2.5t-13-8.5L268-556q-11-11-11-28t11-28q11-11 28-11t28 11l156 156 156-156q11-11 28-11t28 11q11 11 11 28t-11 28L508-372q-6 6-13 8.5t-15 2.5Z"/></svg>
                        </button>
                    </div>
                )}
            </div>
        )}

        
        <div id='report-comment' className='py-2 px-2 '>
            <h2 className="text-base font-semibold mb-2">Comments</h2>
            <div 
                ref={commentsContainerRef} 
                className={`custom-comment ${isPinnedCollapsed ?  null : "h-[220px]" } w-full rounded-md p-4 overflow-y-auto max-h-[320px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-hide`}
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

                                <button onClick={() => handlePinComment(comment.comment_id)} className='btn-pin absolute top-2 right-10' >
                                    <svg className=" p-1 text-[50px]" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M640-760v280l68 68q6 6 9 13.5t3 15.5v23q0 17-11.5 28.5T680-320H520v234q0 17-11.5 28.5T480-46q-17 0-28.5-11.5T440-86v-234H280q-17 0-28.5-11.5T240-360v-23q0-8 3-15.5t9-13.5l68-68v-280q-17 0-28.5-11.5T280-800q0-17 11.5-28.5T320-840h320q17 0 28.5 11.5T680-800q0 17-11.5 28.5T640-760ZM354-400h252l-46-46v-314H400v314l-46 46Zm126 0Z"/></svg>
                                </button>
                            {comment.user.id == auth.user.id &&
                            (   <>
                                    
                                    <button onClick={() => handleDeleteComment(comment.comment_id)} className='btn-delete absolute top-2 right-2' >
                                        <svg className=" p-1 text-[50px]" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM400-280q17 0 28.5-11.5T440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280Zm160 0q17 0 28.5-11.5T600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280ZM280-720v520-520Z"/></svg>
                                    </button>
                                </>
                            )}
                                

                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">Chưa có bình luận nào.</p>
                )}
                <div ref={commentsEndRef} /> {/* ref để đánh dấu vị trí kết thúc danh sách bình luận */}
            </div>

            

            {/* New Comment Input */}
            <div className="mt-2 flex items-center gap-3 relative">
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
                    className="btn-send text-white px-4 py-1.5 rounded-lg transition-all duration-200 ease-in-out"
                >
                    Send
                </button>
            </div>
        </div>
        </>
    );
};

export default ReportComment;
