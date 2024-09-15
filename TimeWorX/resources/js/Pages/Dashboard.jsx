import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardHome from '@/Components/Dashboard/Home';
import DashboardChat from '@/Components/Dashboard/Chat';
import DashboardCalendar from '@/Components/Dashboard/Calendar';
import DashboardFolder from '@/Components/Dashboard/Folder';
import DashboardReport from '@/Components/Dashboard/Report';
import DashboardTask from '@/Components/Dashboard/Task';
import DashboardNotFound from '@/Components/Dashboard/NotFound';
import Profile from './Profile/Edit';

export default function Dashboard({ auth }) {
    return (
        <Router>
            <AuthenticatedLayout user={auth.user}>
                <Routes>
                    <Route path="/dashboard" element={<DashboardHome />} />
                    <Route path="/dashboard/chat" element={<DashboardChat />} />
                    <Route path="/dashboard/calendar" element={<DashboardCalendar />} />
                    <Route path="/dashboard/folder" element={<DashboardFolder />} />
                    <Route path="/dashboard/reports" element={<DashboardReport />} />
                    <Route path="/dashboard/task" element={<DashboardTask />} />

                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<DashboardNotFound />} />
                </Routes>
            </AuthenticatedLayout>
        </Router>
    );
}
