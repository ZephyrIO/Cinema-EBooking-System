'use client';

import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import axios from 'axios';
import MovieCard from "./MovieCard";

import './ManageMovies.css';

const movies = () => {
  const [movies, setMovies] = useState([]);
};

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('/api/movies');
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div>
      <h1>Manage Movies</h1>
    <div>
      {movies.map((movie, index) => (
        <div key={index}>
          <MovieCard movie={movie} />
          <div>
            <button>Add Movie</button>
            <button>Delete Movie</button>
            <button>Edit Movie Schedule</button>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default ManageMovies;