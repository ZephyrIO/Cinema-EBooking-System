'use client'
import { useState } from 'react';
import Header from '@/components/Header';
import Register from '@/components/ManagePromotions';

export default function ManagePromotionsView() {
    return (
        <div>
            <Header />
            <ManagePromotions />
        </div>
    );
}