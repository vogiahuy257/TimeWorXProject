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
                            <li className='mt-2' key={user.id}>
                                <p>{user.name}</p>
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
