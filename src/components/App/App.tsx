
import SearchBar from "../SearchBar/SearchBar"
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";

import type { Movie } from "../../types/movie"
import { useState } from "react"
import { getMoviesByQuery } from "../../services/movieService";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

interface MoviesHttpResponse {
  results: Movie[];
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState < Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSelect = (movie:Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  }; 

  const handleSearch = async (movie: string) => {
    try {
      setIsError(false)
      setIsLoading(true)
      const response: MoviesHttpResponse = await getMoviesByQuery(movie);
         if (response.results.length === 0) {
           toast.error("No movies found for your request.")
           setMovies([])
           return;
      }
      setMovies(response.results);
    }
    catch (e) {
      console.log(e)
      setIsError(true)
    }
    finally {
      setIsLoading(false)
    }
  }
    return (
      <>
        <div><Toaster/></div>
        <SearchBar onSubmit={handleSearch} />
        {movies.length > 0 && !isLoading && <MovieGrid movies={movies} onSelect={handleSelect}  />}
        {isLoading && <Loader/>}
        {isError && <ErrorMessage />}
        {isModalOpen && selectedMovie && (
  <MovieModal
    movie={selectedMovie}
    onClose={() => {
      setSelectedMovie(null);
    }}
  />
)}
      </>
    )
}
     
      

export default App
