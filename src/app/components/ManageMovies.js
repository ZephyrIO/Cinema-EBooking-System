import React from "react";
import MovieCard from "./MovieCard";
import './ManageMovies.css';

const movies = [
  {
    title: "Avatar",
    description: "Avatar movie the blue guys not the airbender",
    trailerLink: "https://www.youtube.com/embed/movie1",
  },
  {
    title: "Kung Fu Panda",
    description: "Fighting Panda",
    trailerLink: "https://www.youtube.com/embed/movie2",
  },
  {
    title: "Avengers",
    description: "Who doesnt know what this is?",
    trailerLink: "https://www.youtube.com/embed/movie3",
  },
];

const ManageMovies = () => {
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
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default ManageMovies;