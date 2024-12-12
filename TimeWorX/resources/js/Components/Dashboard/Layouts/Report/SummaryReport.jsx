import React, { useEffect, useState } from 'react';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/SummaryReport.css';

export default function SummaryReport({ auth ,handleOpenForm}) {

    return (
        <section className='custom-sumary-report h-[506px]'>
                
                {/* nút bấm mở formSummaryReport */}
                <button 
                    onClick={handleOpenForm}
                    className='btn btn-create flex justify-center items-center gap-1 rounded-md absolute top-3 left-3'
                >
                    <p>Create</p>
                    <svg width="18" height="18" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.2192 14.9993H15.0005M15.0005 14.9993H10.7817M15.0005 14.9993V19.218M15.0005 14.9993L15.0005 10.7806M26.25 7.96873L26.25 22.0313C26.25 24.3612 24.3612 26.25 22.0312 26.25H7.96875C5.6388 26.25 3.75 24.3612 3.75 22.0313V7.96873C3.75 5.63879 5.6388 3.75 7.96875 3.75H22.0313C24.3612 3.75 26.25 5.63879 26.25 7.96873Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </button>   

            <div className='w-full h-full bg-while overflow-y-auto max-h-[504px] scrollbar-hide rounded-md mt-8'>
                <h1 className='text-center p-5'>is developing</h1>
            </div>
        </section>
    );
}
