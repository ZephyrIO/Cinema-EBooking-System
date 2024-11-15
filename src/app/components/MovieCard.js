import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './MovieCard.css';
const MovieCard = ({ movie }) => {
    const router = useRouter();

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
            <button onClick={() => router.push(`/${movie._id}`)}>Movie Info</button>
        </div>
    );
};

export default MovieCard;