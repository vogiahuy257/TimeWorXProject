import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Home({ auth }) {
    return (
        <>
            <Head title="Home" />
            <h1>this is Home</h1>
        </>
    );
}
