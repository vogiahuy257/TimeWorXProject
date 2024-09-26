import React, { useState } from "react";
import "./css/TaskForm.css";
import PrimaryButton from "@/Components/PrimaryButton";

const TaskForm = () => {

    const [taskName, setTaskName] = useState('');
    const [deadline, setDeadLine] = useState('');
    const [description, setDescription] = useState('');
  
    const handleSubmit = (event) => {
      event.preventDefault();
    };

    return (
        <section id="task-form">
            <div className="task-form-container">
    
                <form onSubmit={handleSubmit}>
                    <div className="task-form-header">
                        <h2>Create Task</h2>
                        
                        <div className="form-main">
                        <div className="form-group task-group">
                                <label htmlFor="task-name">Task name</label>
                                <input
                                    type="text"
                                    id="task-name"
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                    required
                                />
                        </div>

                        <div className="form-group time-group">
                                <label htmlFor="time-starts">Completion time</label>
                                <input
                                    type="date"
                                    id="time-starts"
                                    value={deadline}
                                    onChange={(e) => setDeadLine(e.target.value)}
                                    required
                                />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                        </div>

                        <div className="user-list">
                            {[1, 2, 3].map((user, index) => (
                                <div className="user-item" key={index}>
                                    <div className="user-info">
                                        <span className="user-icon">
                                            <img src="/image/y.jpg" alt="" />
                                        </span>
                                        <span className="username">
                                            Username{user}
                                        </span>
                                    </div>
                                    <PrimaryButton className="chat-button">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M3 10.4C3 8.15979 3 7.03969 3.43597 6.18404C3.81947 5.43139 4.43139 4.81947 5.18404 4.43597C6.03969 4 7.15979 4 9.4 4H14.6C16.8402 4 17.9603 4 18.816 4.43597C19.5686 4.81947 20.1805 5.43139 20.564 6.18404C21 7.03969 21 8.15979 21 10.4V11.6C21 13.8402 21 14.9603 20.564 15.816C20.1805 16.5686 19.5686 17.1805 18.816 17.564C17.9603 18 16.8402 18 14.6 18H7.41421C7.149 18 6.89464 18.1054 6.70711 18.2929L4.70711 20.2929C4.07714 20.9229 3 20.4767 3 19.5858V18V13V10.4ZM9 8C8.44772 8 8 8.44772 8 9C8 9.55228 8.44772 10 9 10H15C15.5523 10 16 9.55228 16 9C16 8.44772 15.5523 8 15 8H9ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H12C12.5523 14 13 13.5523 13 13C13 12.4477 12.5523 12 12 12H9Z" fill="#222222"/>
                                        </svg>
                                    </PrimaryButton>
                                </div>
                            ))}
                        </div>

                    </div>    

                    <div className="task-form-button">
                    <PrimaryButton className="close-button">
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.5 7.5L7.5 22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7.5 7.5L22.5 22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </PrimaryButton>
                    <PrimaryButton className="add-user-button">
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12.5" cy="10" r="6.25" fill="currentColor"/>
                        <path d="M23.75 12.5L23.75 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M27.5 16.25L20 16.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M21.4388 25.4757C22.0099 25.3463 22.3523 24.7527 22.1 24.2244C21.4107 22.7814 20.2752 21.5133 18.8024 20.5582C16.9943 19.3856 14.779 18.75 12.5 18.75C10.221 18.75 8.00569 19.3856 6.19764 20.5582C4.72482 21.5133 3.58929 22.7813 2.90002 24.2244C2.64766 24.7527 2.99015 25.3463 3.56119 25.4757L3.66506 25.4992C9.48138 26.8164 15.5186 26.8164 21.3349 25.4992L21.4388 25.4757Z" fill="currentColor"/>
                        </svg>
                        <p>Add User</p>
                    </PrimaryButton>

                    <button type="submit" className="save-button">
                        Save
                    </button>
                    </div>
                    
                </form>

            </div>
        </section>
    );
};

export default TaskForm;
