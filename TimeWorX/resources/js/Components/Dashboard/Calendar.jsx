import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProjectCalendar from './Layouts/Calendar/ProjectCalendar';
import { Head } from '@inertiajs/react';

export default function DashboardCalendar({ auth }) {
    return (
        <>
        <Head title="Calendar" />
        <ProjectCalendar auth = {auth}/>
        </>
    );
}
