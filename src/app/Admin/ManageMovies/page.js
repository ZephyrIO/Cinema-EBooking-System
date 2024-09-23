'use client'
import { useState } from 'react';
import Header from '@/components/Header';
import Register from '@/components/ManageMovies';

export default function ManageMoviesView() {
    return (
        <div>
            <Header />
            <ManageMovies />
        </div>
    );
}