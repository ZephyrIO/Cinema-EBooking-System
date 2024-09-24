'use client';

import React from 'react';
import './AdminMainScreen.css';
import { useRouter } from 'next/navigation';


export default function AdminMainScreen() {
    return (
        <div className="adminMainScreen">
        <h1>Admin Dashboard</h1>
        <div className="buttons">
          <button type="button" className="ManageMovies" onClick={() => router.push('/ManageMovies')}>Manage Movies</button>
          <button type="button" className="ManageSchechedule" onClick={() => router.push('/ManageSchedule')}>Manage Movies Schedule</button>
          <button type="button" className="ManageUsers" onClick={() => router.push('/ManageUsers')}>Manage Users</button>
          <button type="button" className="ManagePromotions" onClick={() => router.push('/ManagePromotions')}>Manage Promotions</button>
        </div>
      </div>
    );
}