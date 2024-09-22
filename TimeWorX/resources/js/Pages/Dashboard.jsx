import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardHome from '@/Components/Dashboard/Home';
import DashboardChat from '@/Components/Dashboard/Chat';
import DashboardCalendar from '@/Components/Dashboard/Calendar';
import DashboardProject from '@/Components/Dashboard/Project';
import DashboardReport from '@/Components/Dashboard/Report';
import DashboardTask from '@/Components/Dashboard/Task';
import DashboardNotFound from '@/Components/Dashboard/NotFound';

export default function Dashboard({ auth }) {
    return (
        <Router>
            <AuthenticatedLayout user={auth.user}>
                <Routes>
                    <Route path="/dashboard" element={<DashboardHome auth={auth} />} />
                    <Route path="/dashboard/chat" element={<DashboardChat auth={auth} />} />
                    <Route path="/dashboard/calendar" element={<DashboardCalendar auth={auth}/>} />
                    <Route path="/dashboard/project" element={<DashboardProject auth={auth}/>} />
                    <Route path="/dashboard/reports" element={<DashboardReport auth={auth}/>} />
                    <Route path="/dashboard/task" element={<DashboardTask auth={auth}/>} />
                    <Route path="*" element={<DashboardNotFound />} />
                </Routes>
            </AuthenticatedLayout>
        </Router>
    );
}
