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
                    <Route path="/dashboard" element={<DashboardHome />} />
                    <Route path="/dashboard/chat" element={<DashboardChat />} />
                    <Route path="/dashboard/calendar" element={<DashboardCalendar />} />
                    <Route path="/dashboard/project" element={<DashboardProject />} />
                    <Route path="/dashboard/reports" element={<DashboardReport />} />
                    <Route path="/dashboard/task" element={<DashboardTask />} />
                    <Route path="*" element={<DashboardNotFound />} />
                </Routes>
            </AuthenticatedLayout>
        </Router>
    );
}
