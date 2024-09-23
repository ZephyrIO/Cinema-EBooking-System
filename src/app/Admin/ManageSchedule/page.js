'use client'
import { useState } from 'react';
import Header from '@/components/Header';
import Register from '@/components/ManageSchechedule';

export default function ManageScheduleView() {
    return (
        <div>
            <Header />
            <ManageSchedule />
        </div>
    );
}