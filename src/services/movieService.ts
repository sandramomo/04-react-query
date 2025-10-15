import Axios from "axios";
import type { Movie } from "../types/movie";


interface MoviesHttpResponse {
  results: Movie[];
}

const myKey = import.meta.env.VITE_API_KEY;

const axios = Axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${myKey}`,
  },
  params: {
    include_adult: false,
    language: "en-US",
    page: 1,
  },
});

export function getMoviesByQuery(query: string): Promise<MoviesHttpResponse>
 {
  return axios
    .get<MoviesHttpResponse>("search/movie" , { params: { query } })
    .then((res) => res.data);
}
