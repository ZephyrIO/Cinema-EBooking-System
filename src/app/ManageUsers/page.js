'use client'
import { useState } from 'react';
import Header from '@/components/Header';
import Register from '@/components/ManageUsers';

export default function ManageUsersView() {
    return (
        <div>
            <Header />
            <ManageUsers />
        </div>
    );
}