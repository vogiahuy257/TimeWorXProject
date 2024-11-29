import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div>
            <div >
                <Link href="/" className='logo shadow-md flex justify-center items-center'>
                    <img src="/image/logo-small.svg" alt="Logo" />
                </Link>
                {children}
            </div>
        </div>
    );
}
