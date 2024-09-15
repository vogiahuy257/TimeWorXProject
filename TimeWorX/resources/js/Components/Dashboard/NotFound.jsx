import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Home({ auth }) {
    return (
        <>
            <Head title="Not Found 404" />
            <div style={styles.container}>
                <h1 style={styles.heading}>404 - Page Not Found</h1>
                <p style={styles.message}>The page you are looking for does not exist.</p>
            </div>
        </>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: '0 20px',
    },
    heading: {
        fontSize: '3rem',
        color: '#FF6F61',
        marginBottom: '0.5rem',
    },
    message: {
        fontSize: '1.25rem',
        color: '#333',
    },
};