import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FullCalendarComponent from './Layouts/Calendar/FullCalendarComponent';
import { Head } from '@inertiajs/react';

export default function DashboardCalendar({ auth ,callCreateToken}) {
    return (
        <>
        <Head title="Calendar" />
        <FullCalendarComponent auth = {auth} callCreateToken={callCreateToken}/>
        </>
    );
}
