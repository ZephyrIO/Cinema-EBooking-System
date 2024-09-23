import React from "react";

const MovieCard = ({ movie }) => {
    return (
        <div className="movie-card">
            <h3>{movie.title}</h3>
            <p>{movie.description}</p>
            <div>
                <iframe
                width="320"
                height="240"
                src={movie.trailerLink}
                title="Movie Trailer"
                frameborder="0"
                allowFullScreen
                ></iframe>
            </div>
            <button>Book Movie</button>
        </div>
        
    );
};