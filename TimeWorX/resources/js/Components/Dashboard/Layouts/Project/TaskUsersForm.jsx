import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrimaryButton from '@/Components/PrimaryButton';
import ConfirmationForm from '@/Components/ConfirmationForm';
import "./css/TaskUserForm.css";

const TaskUsers = ({ projectId, onClose ,auth ,setCountUserToProject}) => {
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmationError, setConfirmationError] = useState(false);
    const [messageError, setMessageError] =useState(null);
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
            setMessageError(error.response.data.message || 'Error fetching all users.');
            setConfirmationError(true);
        }
    };
    

    useEffect(() => {
        fetchUsers();
        fetchAllUsers();
    }, [projectId]);

    useEffect(() => {
        if(users.length > 0)
        {
            setCountUserToProject(users.length);
        }
    }, [users])
    
    const handleAddUser = async (user) => {
        if (!users.some(users => users.id === user.id)) {
            try {
                const response = await axios.post(`/api/projects/${projectId}/users`, { user_id: user.id });
                setUsers([...users, user]);
            } catch (error) {
                setMessageError(error.response.data.message || 'Error adding user to project.');
                setConfirmationError(true);
            }
        } else {
            toast.warning('User is already added to this project.'); 
        }
    };

    const handleDeleteUser = async (user) => {
        if (users.some(users => users.id === user.id)) {
            try {
                const response = await axios.delete(`/api/projects/${projectId}/remove-user/${auth.user.id}`, {data: { user_id: user.id }} );
                setUsers(users.filter(existingUser => existingUser.id !== user.id));
            } catch (error) {
                setMessageError(error.response.data.message || 'Error adding user to project.');
                setConfirmationError(true);
            }
        } else {
            toast.warning('User is already added to this project.'); 
        }
    }

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
                    <div className='mt-12 max-h-[480px] h-full overflow-y-auto scrollbar-hide rounded-md'>
                        <ul className="user-list h-full space-y-3 p-4 flex flex-col justify-start items-center ">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <li className='custom-li flex items-center justify-between rounded-md p-3 relative' key={user.id}>
                                        <div className="flex items-center">
                                            <span className="user-icon mr-2">
                                                <img src="/image/y.jpg" alt="" className="w-8 h-8 rounded-full" />
                                            </span>
                                            <p className='text-sm font-medium'>{user.name}</p>
                                        </div>
                                        <div className="flex items-center ">
                                            {/* xây dựng nút chọn phân quyền cho user */}
                                            
                                            <select
                                                className="custom-select w-auto text-sm border rounded-md mr-5"
                                                value={userManagerStatus[user.id] ? '1' : '0'}
                                                onChange={(e) => handleToggleProjectManager(user.id, e.target.value)}
                                            >
                                                <option value="0">Staff</option>
                                                <option value="1">Manager</option>
                                            </select>
                                            <PrimaryButton 
                                                className="btn-out text-sm absolute top-1/2 -translate-y-1/2 -right-3 rounded-full"
                                                onClick={() => handleDeleteUser(user)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-424 364-308q-11 11-28 11t-28-11q-11-11-11-28t11-28l116-116-116-115q-11-11-11-28t11-28q11-11 28-11t28 11l116 116 115-116q11-11 28-11t28 11q12 12 12 28.5T651-595L535-480l116 116q11 11 11 28t-11 28q-12 12-28.5 12T595-308L480-424Z"/></svg>
                                            </PrimaryButton>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="text-center">No users found.</p>
                            )}
                        </ul>
                    </div>
                </div>
                
                <div className='user-list-search'>
                    <h2 className='text-lg whitespace-nowrap px-4 py-2'>List of Users</h2>
                    <div className='mt-10'>
                        <div className='mt-2  flex justify-center items-center relative'>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="p-2 px-3 border rounded-md w-full"
                            />
                            <svg className=' absolute right-2 top-[50%] -translate-y-1/2' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M380-320q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l224 224q11 11 11 28t-11 28q-11 11-28 11t-28-11L532-372q-30 24-69 38t-83 14Zm0-80q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
                        </div>
                        <div className='mt-4 max-h-96 h-full overflow-y-auto scrollbar-hide rounded-md'>
                            <ul className="user-list m-auto p-4 flex flex-col justify-start items-center ">
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
                                                className="custom-btn-app rounded-full w-5 h-5 ml-4 px-1 py-1 text-xs flex items-center justify-center"
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


                {confirmationError ? (
                    <ConfirmationForm 
                        type = {"error"}
                        styleToBox={"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pr-2"}
                        styleToChildren={``}
                        children={messageError}
                        handleConfirm={setConfirmationError}
                    />
                ):null}
            </div>
        </div>
    );
};

export default TaskUsers;
