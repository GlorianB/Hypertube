import axios from "axios";

const url = "https://yts.unblockedproxy.biz/api/v2";
const list = url + "/list_movies.json";
const details = url + "/movie_details.json";

export var searchCancelToken = { id: null, source: null };
export var searchCancelTokenFetch = { id: null, source: null };

export const fetchMovieDetailsYTS = async (movie_id) => {
  try {
    const source = axios.CancelToken.source();
    searchCancelToken.source = source;
    searchCancelToken.id = Math.random().toString();
    const { data } = await axios.get(details, {
      params: {
        movie_id,
        with_images: true,
        with_cast: true,
      },
      withCredentials: false,
      cancelToken: searchCancelToken.source.token,
    });
    if (data) return data;
    return "error";
  } catch (error) {
    console.log("CATCH");
    if (axios.isCancel(error)) {
      throw error;
    } else {
      throw error;
    }
  }
};

export const fetchMovieSearchYTS = async (movie, pageNumber, sort) => {
  try {
    const source = axios.CancelToken.source();
    searchCancelToken.source = source;
    // searchCancelToken.id = Math.random().toString();

    const { data } = await axios.get(list, {
      params: {
        query_term: movie,
        page: pageNumber,
        sort_by: sort ? sort : null,
      },
      withCredentials: false,
      cancelToken: searchCancelToken.source.token,
    });

    const modifiedData = data?.data?.movies?.map((m) => ({
      id: m["id"],
      backPoster: m["large_cover_image"],
      popularity: m["rating"],
      title: m["title"],
      poster: m["large_cover_image"],
      overview: m["summary"],
      rating: m["rating"],
      year: m["year"],
    }));

    return modifiedData;
  } catch (error) {
    if (axios.isCancel(error)) {
      return "error";
    } else {
      return;
    }
  }
};

export const fetchMoviesYTS = async (genre, pageNumber, sort) => {
  try {
    const source = axios.CancelToken.source();
    searchCancelTokenFetch.source = source;

    const { data } = await axios.get(list, {
      params: {
        page: pageNumber,
        genre: genre ? genre : null,
        sort_by: sort ? sort : null,
      },
      withCredentials: false,
      cancelToken: searchCancelTokenFetch.source.token,
    });
    const modifiedData = data.data.movies.map((m) => ({
      id: m["id"],
      backPoster: m["medium_cover_image"],
      popularity: m["rating"],
      title: m["title"],
      poster: m["medium_cover_image"],
      overview: m["summary"],
      rating: m["rating"],
      year: m["year"],
    }));

    return modifiedData;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error;
      return;
    } else {
      throw error;
    }
  }
};
