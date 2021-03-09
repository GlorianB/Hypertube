const express = require("express");

const { checkLoggedIn } = require("../utils/authHandler");

const router = express.Router();

const {
  getMovie,
  postMovie,
  deleteMovie,
  downloadMovie,
  streamMovie,
  streamSubtitles,
} = require("../controllers/movieController");

router.get("/:movie_id", checkLoggedIn, getMovie);

//DL movie
router.post("/downloadMovie", checkLoggedIn, downloadMovie);

//stream subtitles
router.get("/streamSubtitles/:movie_id", checkLoggedIn, streamSubtitles);

//stream movie
router.get("/streamMovie/:movie_id", checkLoggedIn, streamMovie);

router.post("/", checkLoggedIn, postMovie);

router.delete("/:movie_id", checkLoggedIn, deleteMovie);

module.exports = router;
