import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProjectAnalysis({ userId, onClose }) {
    return (
        <section id='project-analysis'>
            <div className='main'>
                <button className='btn-close' onClick={onClose}>
                    <svg className='mx-auto' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1>this is project analysis</h1>
            </div>
        </section>
    );
}