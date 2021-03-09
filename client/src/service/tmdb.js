import axios from "axios";

const apiKey = "c61443eabda628a3182b80fb394a0514";
const url = "https://api.themoviedb.org/3";
const nowPlayingUrl = `${url}/movie/now_playing`;
const genreUrl = `${url}/genre/movie/list`;
const moviesUrl = `${url}/discover/movie`;
const searchUrl = `${url}/search/movie`;

export var searchCancelTokenTmdb = { id: null, source: null };

export const fetchMovieSearchTMDB = async (movie) => {
  try {
    const { data } = await axios.get(searchUrl, {
      params: {
        api_key: apiKey,
        language: "en_US",
        page: 1,
        query: movie,
      },
      withCredentials: false,
    });
    const posterUrl = "https://image.tmdb.org/t/p/original/";
    const modifiedData = data["results"].map((m) => ({
      id: m["id"],
      backPoster: posterUrl + m["backdrop_path"],
      popularity: m["popularith"],
      title: m["title"],
      poster: posterUrl + m["poster_path"],
      overview: m["overview"],
      rating: m["vote_average"],
    }));

    return modifiedData;
  } catch (error) {}
};

export const fetchMoviesTMDB = async () => {
  try {
    const { data } = await axios.get(nowPlayingUrl, {
      params: {
        api_key: apiKey,
        language: "en_US",
        page: 1,
      },
      withCredentials: false,
    });
    axios.defaults.withCredentials = false;
    const posterUrl = "https://image.tmdb.org/t/p/original/";
    const modifiedData = data["results"].map((m) => ({
      id: m["id"],
      backPoster: posterUrl + m["backdrop_path"],
      popularity: m["popularith"],
      title: m["title"],
      poster: posterUrl + m["poster_path"],
      overview: m["overview"],
      rating: m["vote_average"],
    }));
    return modifiedData;
  } catch (error) {}
};

export const fetchGenreTMDB = async () => {
  try {
    const source = axios.CancelToken.source();
    searchCancelTokenTmdb.source = source;
    searchCancelTokenTmdb.id = Math.random().toString();
    const { data } = await axios.get(genreUrl, {
      params: {
        api_key: apiKey,
        language: "en_US",
        page: 1,
      },
      withCredentials: false,
      cancelToken: searchCancelTokenTmdb.source.token,
    });
    const modifiedData = data["genres"].map((g) => ({
      id: g["id"],
      name: g["name"],
    }));
    modifiedData[14].name = "Sci-fi";
    modifiedData[15].name = "Reality-TV";
    return modifiedData;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error;
    } else {
      throw error;
    }
  }
};

export const fetchMovieByGenreTMDB = async (genre_id) => {
  try {
    const { data } = await axios.get(moviesUrl, {
      params: {
        api_key: apiKey,
        language: "en_US",
        page: 1,
        with_genres: genre_id,
      },
      withCredentials: false,
    });
    const posterUrl = "https://image.tmdb.org/t/p/original/";
    const modifiedData = data["results"].map((m) => ({
      id: m["id"],
      backPoster: posterUrl + m["backdrop_path"],
      popularity: m["popularith"],
      title: m["title"],
      poster: posterUrl + m["poster_path"],
      overview: m["overview"],
      rating: m["vote_average"],
    }));

    return modifiedData;
  } catch (error) {}
};

export const fetchPersons = async () => {};

export const fetchTopratedMovie = async () => {};

export const fetchMovieDetail = async (id) => {};

export const fetchMovieVideos = async (id) => {};

export const fetchCasts = async (id) => {};

export const fetchSimilarMovie = async (id) => {};
