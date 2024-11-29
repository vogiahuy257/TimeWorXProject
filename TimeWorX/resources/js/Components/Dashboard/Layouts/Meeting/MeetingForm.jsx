import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./css/meeting.css";

const MeetingForm =  ({ styles, onClose, auth ,meeting ,callCreateToken ,getData}) => {
  const [formData, setFormData] = useState({
    meeting_name: "",
    meeting_description: "",
    meeting_date: "",
    meeting_time: "",
    meeting_type: "",
    created_by_user_id: auth.user.id,
    user_ids: [],
  });

  const [users, setUsers] = useState([]); // To store the user list
  const [searchTerm, setSearchTerm] = useState(""); // To filter user list

  useEffect(() => {
    axios
      .get("/api/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
    if (meeting) {
      // Nếu có meeting, cập nhật dữ liệu form
      setFormData({
        meeting_name: meeting.meeting_name || "",
        meeting_description: meeting.meeting_description || "",
        meeting_date: meeting.meeting_date ? meeting.meeting_date.split('T')[0] : "",
        meeting_time: meeting.meeting_time || "",
        meeting_type: meeting.meeting_type || "",
        created_by_user_id: meeting.created_by_user_id || null,
        user_ids: Array.isArray(meeting.users) ? meeting.users.map(user => user.id) : [],
      });
    }

  }, [meeting]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUserSelection = (userId) => {
    setFormData((prevData) => ({
      ...prevData,
      user_ids: prevData.user_ids.includes(userId)
        ? prevData.user_ids.filter((id) => id !== userId)
        : [...prevData.user_ids, userId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const apiCall = meeting
    ? axios.put(`/api/meetings/${meeting.meeting_id}`, formData)  // Cập nhật cuộc họp hiện tại
    : axios.post("/api/meetings", formData);  // Tạo cuộc họp mới

    meeting ? callCreateToken() : null;

    apiCall
      .then((response) => {
        toast.success(meeting ? "Meeting has been updated successfully!" : "Meeting has been created successfully!");
        onClose();
        getData();
      })
      .catch((error) => {
        console.error("Error creating meeting:", error);
      });
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="form-meeting" className={`${styles} fixed flex w-full h-full top-0 left-0 rounded-lg`}>
        <div  className="main h-[90%] p-4 max-w-[800px] flex flex-row-reverse rounded-md relative w-[80%] m-auto">

            <button className="btn-close pt-4 px-1 pb-1 rounded-b-full absolute top-0 right-4 " onClick={onClose}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
                </svg>
            </button>

            {/* Left Section: User List */}
            <div className="w-1/3 gap-4 flex flex-col justify-center items-center rounded-md ">

                <div className="user-list-content w-full h-1/2 p-4 rounded-md">
                  <h3 className="text-header text-lg font-semibold">User List</h3>

                  <input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-1 mb-4 border border-gray-300 rounded"
                  />

                  <ul className="h-full py-2 flex justify-center items-center gap-2 flex-col max-h-[180px] overflow-y-auto scrollbar-hide">
                  {filteredUsers.map((user) => {
                    
                    if (user && (user.id === meeting?.created_by_user_id || auth.user.id === user.id)) {
                      return null; // Bỏ qua nếu user.id trùng với created_by_user_id
                    }

                    return (
                      <li
                        key={user.id}
                        className={`w-full flex items-center justify-between p-2 border rounded cursor-pointer shadow ${
                          formData.user_ids.includes(user.id) ? "bg-blue-100" : ""
                        }`}
                        onClick={() => handleUserSelection(user.id)}
                      >
                        <span>{user.name}</span>
                        <input
                          type="checkbox"
                          checked={formData.user_ids.includes(user.id)}
                          readOnly
                          className="h-4 w-4 rounded-sm text-blue-600"
                        />
                      </li>
                    );
                  })}

                  </ul>
                </div>

                <div className="user-list-content h-1/2 w-full p-4 rounded-md">
                  <div className="flex gap-2 items-center">
                    <h3 className="text-header text-lg font-semibold">Invited Users</h3>
                    <p className="text-base ml-auto gap-1 flex justify-center items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                        <path d="M40-272q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v32q0 33-23.5 56.5T600-160H120q-33 0-56.5-23.5T40-240v-32Zm800 112H738q11-18 16.5-38.5T760-240v-40q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v40q0 33-23.5 56.5T840-160ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z"/>
                      </svg>
                      {formData.user_ids.length}
                    </p>
                  </div>
                    <ul className="mt-2 py-1 space-y-2 max-h-[200px] overflow-auto scrollbar-hide">
                    {formData.user_ids.map((userId) => {
                        const user = users.find((u) => u.id === userId);
                        if (user && (user.id === meeting?.created_by_user_id || auth.user.id === user.id)) {
                          return null; // Bỏ qua nếu user.id trùng với created_by_user_id
                        }
                        return user ? (
                        <li key={user.id} onClick={() => handleUserSelection(user.id)} className="user-box w-full flex items-center justify-between p-2 border rounded cursor-pointer shadow">
                            {user.name}
                            <input
                                type="checkbox"
                                checked={formData.user_ids.includes(user.id)}
                                readOnly
                                className="h-4 w-4 rounded-sm text-blue-600"
                            />
                        </li>
                        ) : null;
                    })}
                    </ul>
                </div>

            </div>

            {/* Right Section: Form */}
            <div className="user-list-content w-2/3 mr-4 h-full rounded-md shadow p-4">
              <form onSubmit={handleSubmit} className="w-full h-full flex flex-col gap-2">
              
                <h3 className="text-header text-lg font-semibold">{meeting ? 'Edit Meeting' : 'Create Meeting'}</h3>
                {meeting && (
                  <p>Created by: {meeting.creator.name}</p>
                )}
                <div className="box-form">
                    <label htmlFor="meeting_name" className="text-sm font-medium">
                    Meeting Name
                    </label>
                    <input
                    type="text"
                    id="meeting_name"
                    name="meeting_name"
                    value={formData.meeting_name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    />
                </div>

                <div className="box-form w-full h-auto">
                    <label htmlFor="meeting_description" className="text-sm font-medium">
                    Meeting Description
                    </label>
                    <textarea
                    id="meeting_description"
                    name="meeting_description"
                    value={formData.meeting_description}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full h-auto h-max-[200px] border border-gray-300 rounded-md"
                    ></textarea>
                </div>

                <div className="box-form flex w-full relative">
                  <div className="w-1/2">
                    <label htmlFor="meeting_date" className="text-sm font-medium">
                    Meeting Date
                    </label>
                    <input
                    type="date"
                    id="meeting_date"
                    name="meeting_date"
                    value={formData.meeting_date}
                    onChange={handleInputChange}
                    required
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    />
                  </div>
                    <p className="font-semibold text-base absolute left-1/2 -translate-x-1/2 top-9">-</p>
                  <div className="w-1/2 ml-8">
                    <label htmlFor="meeting_time" className="text-sm font-medium">
                    Meeting Time
                    </label>
                    <input
                    type="time"
                    id="meeting_time"
                    name="meeting_time"
                    value={formData.meeting_time}
                    onChange={handleInputChange}
                    required
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="box-form">
                    <label htmlFor="meeting_type" className="text-sm font-medium">
                    Meeting Type
                    </label>
                    <input
                    type="text"
                    id="meeting_type"
                    name="meeting_type"
                    value={formData.meeting_type}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    />
                </div>

                <button
                    type="submit"
                    className="btn-submit mx-auto w-3/4 mt-auto py-2 px-4 rounded-md"
                >
                    {meeting ? 'Update Meeting' : 'Create Meeting'}
                </button>
                </form>
            </div>

        </div>
    </div>
  );
};

export default MeetingForm;
