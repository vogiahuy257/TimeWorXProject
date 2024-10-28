import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrimaryButton from '@/Components/PrimaryButton';
import "./css/TaskUserForm.css";

const TaskUsers = ({ projectId, onClose }) => {
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [userManagerStatus, setUserManagerStatus] = useState({});


    const fetchUsers = async () => {
        try {
            const response = await axios.get(`/api/project-view/${projectId}/users`);
            setUsers(response.data);
            const initialStatus = response.data.reduce((acc, user) => {
                acc[user.id] = user.pivot.is_project_manager || 0; // Thiết lập trạng thái ban đầu cho người dùng
                return acc;
            }, {});
            setUserManagerStatus(initialStatus);
        } catch (error) {
            toast.error('Error fetching users.');
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get('/api/users'); 
            setAllUsers(response.data);
        } catch (error) {
            toast.error('Error fetching all users.');
        }
    };
    

    useEffect(() => {
        fetchUsers();
        fetchAllUsers();
    }, [projectId]);
    
    const handleAddUser = async (user) => {
        if (!users.some(users => users.id === user.id)) {
            try {
                const response = await axios.post(`/api/projects/${projectId}/users`, { user_id: user.id });
                setUsers([...users, user]);
            } catch (error) {
                toast.error(error.response.data.message || 'Error adding user to project.'); 
            }
        } else {
            toast.warning('User is already added to this project.'); 
        }
    };

    const handleToggleProjectManager = async (userId, value) => {
        const isProjectManager = value === "1" ? true : false;
    
        // Cập nhật trạng thái người quản lý trong state
        setUserManagerStatus((prevStatus) => ({
            ...prevStatus,
            [userId]: isProjectManager ? 1 : 0,
        }));
    
        // Gọi API để cập nhật quyền
        try {
            const response = await axios.put(`/api/projects/${projectId}/user-role`, {
                user_id: userId,
                is_project_manager: isProjectManager,
            });
            
        } catch (error) {
            console.error('Error updating user role:', error.response.data.error);
        }
    };

    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) && !users.some(addedUser => addedUser.id === user.id)
    );

    return (
        <div className="user-list-overlay">
            <div className="user-list-modal">
                
                <PrimaryButton className='btn-close' onClick={onClose}> 
                    <svg className='mx-auto' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
                    </svg>
                </PrimaryButton>

                <div className='user-list-active mr-2'>
                    <h2 className='text-lg whitespace-nowrap px-4 py-2'>List of users in the project</h2>
                    <ul className="user-list space-y-3 mt-14">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <li className='custom-li flex items-center justify-between rounded-md p-3' key={user.id}>
                                    <div className="flex items-center">
                                        <span className="user-icon mr-2">
                                            <img src="/image/y.jpg" alt="" className="w-8 h-8 rounded-full" />
                                        </span>
                                        <p className='text-sm font-medium'>{user.name}</p>
                                    </div>
                                    <div className="flex items-center">
                                        {/* xây dựng nút chọn phân quyền cho user */}
                                        
                                        <select
                                            className="w-auto text-sm border border-gray-300 rounded-md"
                                            value={userManagerStatus[user.id] ? '1' : '0'}
                                            onChange={(e) => handleToggleProjectManager(user.id, e.target.value)}
                                        >
                                            <option value="0">Staff</option>
                                            <option value="1">Manager</option>
                                        </select>
                                        <PrimaryButton 
                                            className="ml-4 mr-2 text-sm"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M3 10.4C3 8.15979 3 7.03969 3.43597 6.18404C3.81947 5.43139 4.43139 4.81947 5.18404 4.43597C6.03969 4 7.15979 4 9.4 4H14.6C16.8402 4 17.9603 4 18.816 4.43597C19.5686 4.81947 20.1805 5.43139 20.564 6.18404C21 7.03969 21 8.15979 21 10.4V11.6C21 13.8402 21 14.9603 20.564 15.816C20.1805 16.5686 19.5686 17.1805 18.816 17.564C17.9603 18 16.8402 18 14.6 18H7.41421C7.149 18 6.89464 18.1054 6.70711 18.2929L4.70711 20.2929C4.07714 20.9229 3 20.4767 3 19.5858V18V13V10.4ZM9 8C8.44772 8 8 8.44772 8 9C8 9.55228 8.44772 10 9 10H15C15.5523 10 16 9.55228 16 9C16 8.44772 15.5523 8 15 8H9ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H12C12.5523 14 13 13.5523 13 13C13 12.4477 12.5523 12 12 12H9Z" fill="currentColor"/>
                                            </svg>
                                        </PrimaryButton>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p className="text-center">No users found.</p>
                        )}
                    </ul>
                </div>
                
                <div className='user-list-search'>
                    <h2 className='text-lg whitespace-nowrap px-4 py-2'>List of Users</h2>
                    <div className='mt-10'>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mt-2 p-2 px-3 border rounded-md w-full"
                    />
                    <ul className="user-list p-4">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <li className='flex items-center justify-between mb-3 rounded-md p-2 custom-li' key={user.id}>
                                    <div className="flex items-center">
                                        <span className="user-icon">
                                            <img src="/image/y.jpg" alt="" className="w-8 h-8 rounded-full" />
                                        </span>
                                        <p className='ml-2 text-sm'>{user.name}</p>
                                    </div>
                                    <PrimaryButton
                                        className="custom-btn-app rounded-md w-5 h-5 ml-4 px-1 py-1 text-xs flex items-center justify-center"
                                        onClick={() => handleAddUser(user)}
                                    >
                                        +
                                    </PrimaryButton>
                                </li>
                            ))
                        ) : (
                            <p className='text-center text-gray-500'>No users found</p>
                        )}
                    </ul>
                    </div>
                </div>



            </div>
        </div>
    );
};

export default TaskUsers;
