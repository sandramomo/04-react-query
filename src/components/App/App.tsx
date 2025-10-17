
import SearchBar from "../SearchBar/SearchBar"
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import css from './App.module.css'

import type { Movie } from "../../types/movie"
import { useEffect, useState } from "react"
import { getMoviesByQuery } from "../../services/movieService";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";


function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error, isFetching, isSuccess } = useQuery({
    queryKey: ["movie", searchQuery, currentPage],
    queryFn: () => getMoviesByQuery(searchQuery, currentPage),
    enabled: searchQuery !== '',
    placeholderData: keepPreviousData,
  })
  const totalPages = data?.total_pages ?? 0;
  
  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  }; 

  const handleSearch = async (query: string) => {
      if (!query.trim()) {
    toast.error("Please enter your search query.");
    return;
    }
    
    setSearchQuery(query); 
    setCurrentPage(1);
  }
 useEffect(() => {
    if (isSuccess && data && data.results.length === 0) {
      toast("No movies found for your request.");
    }
  }, [isSuccess, data]);

    return (
      <>
        <div><Toaster/></div>
        <SearchBar onSubmit={handleSearch} />
        {!isLoading && data && <MovieGrid movies={data.results} onSelect={handleSelect}  />}
        {isLoading || isFetching ? <Loader/>: null}
        {isError && <ErrorMessage error ={ error } />}
        {selectedMovie && (
  <MovieModal
    movie={selectedMovie}
    onClose={() => {
      setSelectedMovie(null);
    }}
  />
        )}
  {data && totalPages > 1 && (
  <ReactPaginate
    pageCount={totalPages}
    pageRangeDisplayed={5}
    marginPagesDisplayed={1}
    onPageChange={({ selected }) => setCurrentPage(selected + 1)}
    forcePage={currentPage - 1}
    nextLabel="→"
            previousLabel="←"
            containerClassName={css.pagination}
activeClassName={css.active}
  />
)}
      </>
    )
}
     
      

export default App
