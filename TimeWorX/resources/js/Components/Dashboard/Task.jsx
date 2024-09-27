import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Task({ auth }) {
    return (
        <>
            <Head title="Task" />
            <h1>this is Task</h1>
        </>
    );
}
