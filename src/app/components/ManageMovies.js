import MovieCard from './MovieCard';
import './ManageMovies.css';

const ManageMovies = ({ movies }) => {
  return (
    <div className="manageMovies">
      {movies.map((movie) => (
        <div className="movieCardContainer" key={movie.title}>
          <MovieCard movie={movie} />
          <div className="movieCardActions">
            <button className="editButton">Edit</button>
            <button className="deleteButton">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageMovies;
