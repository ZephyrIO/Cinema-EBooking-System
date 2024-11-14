import React from 'react';
import Link from 'next/link';
import './MovieCard.css';
const MovieCard = ({ movie }) => {
    return (
        <Link href={`/${movie._id}`}>
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
        </Link>
    );
};

export default MovieCard;
