import React from "react";
import MovieCard from "./MovieCard";

const movies = [
  {
    title: "Movie1",
    description: "Movie1",
    trailerLink: "https://www.youtube.com/embed/movie1",
  },
  {
    title: "Movie2",
    description: "This is another movie",
    trailerLink: "https://www.youtube.com/embed/movie2",
  },
  {
    title: "Movie3",
    description: "This is yet another movie",
    trailerLink: "https://www.youtube.com/embed/movie3",
  },
];

const ManageMovies = () => {
  return (
    <div>
      {movies.map((movie, index) => (
        <div key={index}>
          <MovieCard movie={movie} />
          <div>
            <button>Add Movie</button>
            <button>Delete Movie</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageMovies;