import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardHome from '@/Components/Dashboard/Home';
import DashboardChat from '@/Components/Dashboard/Chat';
import DashboardCalendar from '@/Components/Dashboard/Calendar';
import DashboardProject from '@/Components/Dashboard/Project';
import DashboardReport from '@/Components/Dashboard/Report';
import DashboardTask from '@/Components/Dashboard/Task';
import DashboardNotFound from '@/Components/Dashboard/NotFound';
import DashboardProjectView from "@/Components/Dashboard/DashboardProjectView";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function Dashboard({ auth ,token}) {
        const [isTokenReady, setIsTokenReady] = useState(false); // Trạng thái kiểm tra token

        const callCreateToken = (savedToken) => {
            const tokenToUse = savedToken || token; // Sử dụng token từ props hoặc localStorage
            if (tokenToUse) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${tokenToUse}`;
                localStorage.setItem('authToken', tokenToUse); // Lưu token vào localStorage
                setIsTokenReady(true); // Token đã sẵn sàng
            } else {
                console.error("Token is undefined or expired");
            }
        };

        useEffect(() => {
            const savedToken = localStorage.getItem('authToken') || token; // Kiểm tra cả localStorage và props
            if (savedToken) {
                callCreateToken(savedToken); // Thiết lập token
            } else {
                console.warn("No token found, redirecting to login...");
                setIsTokenReady(true); // Tiếp tục nếu token không có (dành cho các route công khai)
            }
        }, [token]); // Lắng nghe thay đổi token từ props

        if (!isTokenReady) {
            // Render loading state hoặc giữ lại cho đến khi token được thiết lập
            return <div>Loading...</div>;
        }

    return (
        <Router>
            <AuthenticatedLayout user={auth.user}>
            <ToastContainer className="custom_toast"/>
                <Routes>
                    <Route path="/dashboard" element={<DashboardHome auth={auth} callCreateToken = {callCreateToken}/>} />
                    <Route path="/dashboard/chat" element={<DashboardChat auth={auth} />} />
                    <Route path="/dashboard/calendar" element={<DashboardCalendar auth={auth} callCreateToken = {callCreateToken}/>} />
                    <Route path="/dashboard/project" element={<DashboardProject auth={auth}/>} />
                    <Route path="/dashboard/reports" element={<DashboardReport auth={auth}/>} />
                    <Route path="/dashboard/task" element={<DashboardTask auth={auth}/>} />

                    <Route path="/dashboard/projects/:project_id" element={<DashboardProjectView auth={auth}/>} />
                    <Route path="/*" element={<DashboardNotFound auth={auth}/>} />
                </Routes>
            </AuthenticatedLayout>
        </Router>
    );
}
