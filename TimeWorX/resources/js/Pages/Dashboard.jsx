import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useEffect } from 'react';
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

    const callCreateToken = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    useEffect(() => {
        callCreateToken();
    }, [token]);
    
    return (
        <Router>
            <AuthenticatedLayout user={auth.user}>
            <ToastContainer className="custom_toast"/>
                <Routes>
                    <Route path="/dashboard" element={<DashboardHome auth={auth} callCreateToken = {callCreateToken}/>} />
                    <Route path="/dashboard/chat" element={<DashboardChat auth={auth} />} />
                    <Route path="/dashboard/calendar" element={<DashboardCalendar auth={auth}/>} />
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
