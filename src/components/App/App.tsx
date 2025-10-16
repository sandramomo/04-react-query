
import SearchBar from "../SearchBar/SearchBar"
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import css from './App.module.css'

import type { Movie } from "../../types/movie"
import { useState } from "react"
import { getMoviesByQuery } from "../../services/movieService";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";


function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["movie", searchQuery, currentPage],
    queryFn: () => getMoviesByQuery(searchQuery, currentPage),
    enabled: searchQuery !== '',
    placeholderData: keepPreviousData,
  })
  const totalPages = data?.total_pages ?? 0;
  
  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  }; 

  const handleSearch = async (query: string) => {
      if (!query.trim()) {
    toast.error("Please enter your search query.");
    return;
      }
    setSearchQuery(query); 
    setCurrentPage(1);
  }


    return (
      <>
        <div><Toaster/></div>
        <SearchBar onSubmit={handleSearch} />
        {!isLoading && data && <MovieGrid movies={data.results} onSelect={handleSelect}  />}
        {isLoading && <Loader/>}
        {isError && <ErrorMessage error ={ error } />}
        {isModalOpen && selectedMovie && (
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
