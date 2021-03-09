import axios from "axios";

const url = "http://localhost:5000/api/v1";
const movie = url + "/movie";
export var searchCancelTokenMovie = { id: null, source: null };
export var downloadCancel = { id: null, source: null };

export const fetchMovieDetails = async (movie_id) => {
  try {
    const source = axios.CancelToken.source();
    searchCancelTokenMovie.source = source;
    searchCancelTokenMovie.id = Math.random().toString();
    const { data } = await axios.get(movie + `/${movie_id}`, {
      withCredentials: true,
      cancelToken: searchCancelTokenMovie.source.token,
    });
    return data;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error;
    } else {
      throw error;
    }
  }
};

export const postMovieDetails = async (movieData) => {
  try {
    const { data } = await axios.post(movie, {
      withCredentials: true,
      body: movieData,
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const downloadMovieInServer = async (movieDetails, torrent) => {
  try {
    const source = axios.CancelToken.source();
    downloadCancel.source = source;
    downloadCancel.id = Math.random().toString();
    const { data } = await axios.post(
      movie + "/downloadMovie",
      { movieDetails, torrent },
      {
        withCredentials: true,
        cancelToken: downloadCancel.source.token,
      },
    );

    return data;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error;
    } else {
      throw error;
    }
  }
};
