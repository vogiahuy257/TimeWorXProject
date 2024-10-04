import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrimaryButton from '../PrimaryButton';

export default function Home({ auth }) {
    return (
        <>
        <ToastContainer className="custom_toast"/>
        <Head title="Home" />
            <section id="home">
                <div className='box box-header'>

                </div>
                <div className='box box-meeting'>
                    <div className='flex justify-center meeting-header'>
                          <h1>Lịch họp</h1>
                          <PrimaryButton className="ml-auto flex btn-add-meeting">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 6L12 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M18 12L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                <p>Tạo</p>
                          </PrimaryButton>
                    </div>
                </div>
                <div className='box box-content'>

                </div>
            </section>
        </>
    );
}
