import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrimaryButton from '@/Components/PrimaryButton';
import "./css/TaskUserForm.css";

const TaskUsers = ({ projectId, onClose }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`/api/project-view/${projectId}/users`);
                setUsers(response.data);
            } catch (error) {
                toast.error('Error fetching users.');
            }
        };

        fetchUsers();
    }, [projectId]);

    return (
        <div className="user-list-overlay">
            <div className="user-list-modal">
                <h2 className='text-center font-semibold'>List of users in the project</h2>
                <ul className="user-list mt-1">
                    {users.length > 0 ? (
                        users.map((user) => (
                            <li className='flex mt-2' key={user.id}>
                                <div className="flex user-info">
                                    <span className="user-icon">
                                        <img src="/image/y.jpg" alt="" />
                                    </span>
                                    <p className='ml-2'>{user.name}</p>
                                </div>
                                <PrimaryButton 
                                    className="ml-auto chat-button"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M3 10.4C3 8.15979 3 7.03969 3.43597 6.18404C3.81947 5.43139 4.43139 4.81947 5.18404 4.43597C6.03969 4 7.15979 4 9.4 4H14.6C16.8402 4 17.9603 4 18.816 4.43597C19.5686 4.81947 20.1805 5.43139 20.564 6.18404C21 7.03969 21 8.15979 21 10.4V11.6C21 13.8402 21 14.9603 20.564 15.816C20.1805 16.5686 19.5686 17.1805 18.816 17.564C17.9603 18 16.8402 18 14.6 18H7.41421C7.149 18 6.89464 18.1054 6.70711 18.2929L4.70711 20.2929C4.07714 20.9229 3 20.4767 3 19.5858V18V13V10.4ZM9 8C8.44772 8 8 8.44772 8 9C8 9.55228 8.44772 10 9 10H15C15.5523 10 16 9.55228 16 9C16 8.44772 15.5523 8 15 8H9ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H12C12.5523 14 13 13.5523 13 13C13 12.4477 12.5523 12 12 12H9Z" fill="currentColor"/>
                                    </svg>
                                </PrimaryButton>
                            </li>
                            
                        ))
                    ) : (
                        <p>No users found.</p>
                    )}
                </ul>
                <PrimaryButton className='btn-close' onClick={onClose}> 
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
                    </svg>
                </PrimaryButton>
            </div>
        </div>
    );
};

export default TaskUsers;
