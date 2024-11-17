import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrimaryButton from '../PrimaryButton';
import { useState,useEffect } from 'react';
import MeetingForm from './Layouts/Meeting/MeetingForm';
import { format } from 'date-fns';

export default function Home({ auth,callCreateToken }) {
    const [isFormOpen, setIsFormOpen] = useState(false); 

    const [meetings, setMeetings] = useState([]);
    const [currentMeeting, setCurrentMeeting] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleOpenFormCreateMeeting = () => {
        setCurrentMeeting(null);
        setIsFormOpen(!isFormOpen);
    };

    const handleEditMeeting = (meeting) => {
        setCurrentMeeting(meeting);
        setIsFormOpen(true);
    };

    const getData = () => {
        callCreateToken();
        axios.get('/api/meetings')
        .then(response => {
            setMeetings(response.data); // Lưu danh sách cuộc họp vào state
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching meetings:', error);
            setLoading(false);
        });
    }

    useEffect(() => {
        getData();
    }, [auth.user]);

    if (loading) {
        return <p>Đang tải danh sách cuộc họp...</p>;
    }

    return (
        <>
        <Head title="Home" />
            <section id="home" className=' overflow-auto scrollbar-hide'>

                <div className='box box-header'>

                </div>

                <div className='box box-meeting '>
                    <div className='flex justify-center meeting-header w-full items-center p-3'>
                          <h1 className='text-meeting text-base font-base py-1 px-2 rounded-md'>Your Meeting</h1>
                          <PrimaryButton onClick={handleOpenFormCreateMeeting} className="ml-auto rounded-full flex justify-center items-center btn-add-meeting p-1">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 6L12 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M18 12L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                          </PrimaryButton>
                    </div>
                    <div className='meeting-list flex w-full  relative'>
                        {meetings.length === 0 ? (
                            <p className='mx-auto mt-[38%] px-4 py-2 rounded-md'>Không có cuộc họp nào.</p>
                        ) : (
                            <ul className="p-3 meeting-list w-full flex flex-col h-auto overflow-y-auto max-h-[230px] scrollbar-hide rounded-xl sm:max-h-[500px]">
                                {meetings.map((meeting) => (
                                    <li key={meeting.meeting_id} className="meeting-item w-full border rounded-xl pt-2 p-4 mb-2 shadow">
                                        <button 
                                            className='flex flex-col w-full relative'
                                            onClick={() => handleEditMeeting(meeting)}
                                        >

                                                <h3 className="text-base font-semibold mb-1">{meeting.meeting_name}</h3>

                                                <div className=" flex items-center text-sm mb-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor"><path d="M580-240q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/></svg>
                                                    <p className='ml-1'> {format(new Date(meeting.meeting_date), 'dd-MM-yyyy')} - {format(new Date(`${format(new Date(meeting.meeting_date), 'yyyy-MM-dd')}T${meeting.meeting_time}.000000Z`), 'hh:mm a')}</p>
                                                </div>

                                            {/* <p className="text-sm">description: {meeting.meeting_description || 'Không có mô tả.'}</p> */}
                                            <div className="flex items-center text-sm">
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.4635 11.3199C11.7859 11.2527 11.978 10.9152 11.8178 10.6274C11.4645 9.99297 10.908 9.43544 10.1961 9.01056C9.27918 8.46335 8.15577 8.16675 7.00007 8.16675C5.84436 8.16675 4.72095 8.46335 3.80407 9.01055C3.09215 9.43543 2.53563 9.99296 2.18238 10.6274C2.02214 10.9152 2.21419 11.2527 2.53667 11.3199C5.48064 11.9334 8.51949 11.9334 11.4635 11.3199Z" fill="currentColor"/>
                                                    <circle cx="6.99992" cy="4.66667" r="2.91667" fill="currentColor"/>
                                                </svg>
                                                <p className='ml-1'>Create by:  {meeting.creator.name}</p>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                
                <div className='box box-content'>
                    <h1>khong6v iết đê gì</h1>
                </div>
            </section>

            {isFormOpen && (
                <MeetingForm onClose={handleOpenFormCreateMeeting} auth={auth} meeting={currentMeeting} callCreateToken = {callCreateToken} getData = {getData}/>
            )}
        </>
    );
}
