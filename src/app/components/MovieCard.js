'use client';
import React from "react";

const MovieCard = ({ movie }) => {
    return (
        <div className="movie-card">
            <h3>{movie.title}</h3>
            <p>{movie.description}</p>
            <p>{movie.rating}</p>
            <div>
                <iframe
                width="320"
                height="240"
                src={movie.trailerLink}
                title="Movie Trailer"
                frameBorder="0"
                allowFullScreen
                ></iframe>
            </div>
        </div>
        
    );
};

export default MovieCard;