const fs = require("fs");
const path = require("path");
var srt2vtt = require("srt-to-vtt");
var FormData = require("form-data");
const CronJob = require("cron").CronJob;

const torrentStream = require("torrent-stream");

const Movie = require("../models/Movie");
const torrentConfig = require("../config/torrentConfig");

const { forReadStream } = require("../utils/streamHandler");

// controller fetch movie (GET)
exports.getMovie = async (req, res, next) => {
  try {
    const { movie_id } = req.params;
    const movie = await Movie.getMovie(movie_id);
    if (!movie) return res.status(200).json({ movie_id: movie_id, comments: [] });
    return res.status(200).json({ movie_id: movie.movie_id, comments: movie.comments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server internal error" });
  }
};

// controller send or update movie (POST)
exports.postMovie = async (req, res, next) => {
  try {
    const { body } = req.body;
    const result = await Movie.insertMovie(body);
    if (!result) return res.status(401).json({ status: "error", message: "Erreur lors de l'enregistrement du film" });
    return res.status(200).json({ status: "success", message: "Film/Commentaires sauvegardés" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server internal error" });
  }
};

// controller delete movie (DELETE)
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie_id = req.params;
    const result = await Movie.deleteMovie(movie_id);
    return res.status(200).json({ status: "success", message: "Film/Commentaires supprimés" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server internal error" });
  }
};

// download movie
exports.downloadMovie = async (req, res, next) => {
  try {
    const { movieDetails, torrent } = req.body;

    const pathMovie = process.cwd() + "/Movies/" + movieDetails.id;

    if (fs.existsSync(pathMovie)) {
      return res.status(200).json({ status: "success", message: "Movie Downloaded" });
    }

    const options = torrentConfig(movieDetails.id);

    const magnetURI = "magnet:?xt=urn:btih:" + torrent.hash + "&dn=" + movieDetails.title + "_" + torrent.quality;

    const engine = torrentStream(magnetURI, options);

    const job = new CronJob(
      "45 59 2 * * *", // Tous les jours a 03:00
      () => {
        engine.remove(() => {
          // console.log("Remove stream");
        });
        engine.destroy(() => {
          // console.log("Stream stopped");
        });
      },
      null,
      true,
      "Europe/Paris"
    );

    let piecesTotalNumber;
    let piecesNumber = 0;

    engine.on("ready", () => {
      let stream;
      for (const file of engine.files) {
        stream = file.createReadStream();
      }
    });
    engine.on("torrent", (torrent) => {
      piecesTotalNumber = torrent.pieces.length;
    });

    engine.on("download", (pieceIndex) => {
      piecesNumber++;
      if (piecesNumber === Math.ceil(piecesTotalNumber / 100)) {
        res.status(200).json({ status: "success", message: "Movie Downloaded" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server internal error" });
  }
};

exports.streamMovie = async (req, res, next) => {
  try {
    const range = req.headers.range;
    const pathMovie = process.cwd() + "/Movies/" + req.params.movie_id;

    fs.readdir(pathMovie, (err, file) => {
      if (err) console.log(err);
      else if (path.extname(file[0]) == ".mkv" || path.extname(file[0]) == ".mp4") {
        const videoPath = path.resolve(pathMovie, file[0]);
        const videoSize = fs.statSync(videoPath).size;

        const CHUNK_SIZE = 100 ** 6; // 1MB
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        // Create headers
        const contentLength = end - start + 1;
        const headers = {
          "Content-Range": `bytes ${start}-${end}/${videoSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": contentLength,
          "Content-Type": "video/mp4",
        };

        // HTTP Status 206 for Partial Content
        res.writeHead(206, headers);

        // create video read stream for this particular chunk
        const videoStream = fs.createReadStream(videoPath, { start, end });

        const job = new CronJob(
          "45 59 2 * * *", // Tous les jours a 03:00
          () => {
            videoStream.close();
          },
          null,
          true,
          "Europe/Paris"
        );
        job.start();

        // Stream the video chunk to the client
        videoStream.pipe(res);
      } else {
        const fullPath = pathMovie + "/" + file[0];

        fs.readdir(fullPath, (err, f) => {
          f.forEach((el) => {
            if (path.extname(el) == ".mp4" || path.extname(el) == ".mkv") {
              // get video stats (about 61MB)
              const videoPath = path.resolve(fullPath, el);
              const videoSize = fs.statSync(videoPath).size;

              // Parse Range
              // Example: "bytes=32324-"
              const CHUNK_SIZE = 100 ** 6; // 1MB
              const start = Number(range.replace(/\D/g, ""));
              const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

              // Create headers
              const contentLength = end - start + 1;
              const headers = {
                "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": contentLength,
                "Content-Type": "video/mp4",
              };

              // HTTP Status 206 for Partial Content
              res.writeHead(206, headers);

              // create video read stream for this particular chunk
              const videoStream = fs.createReadStream(videoPath, { start, end });

              const job = new CronJob(
                "45 59 2 * * *", // Tous les jours a 03:00
                () => {
                  videoStream.close();
                  console.log("streammovie stop");
                },
                null,
                true,
                "Europe/Paris"
              );
              job.start();

              console.log("after streamovie stop");

              // Stream the video chunk to the client
              videoStream.pipe(res);
            }
          });
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server internal error" });
  }
};

exports.streamSubtitles = async (req, res, next) => {
  try {
    const pathMovie = process.cwd() + "/Movies/" + req.params.movie_id;

    fs.readdir(pathMovie, (err, file) => {
      if (err) console.log(err);
      else {
        const fullPath = pathMovie + "/" + file[0];

        fs.readdir(fullPath, (err, f) => {
          if (!f) {
            return res.status(200).json({ message: "no subtitles" });
          }

          if (!f.find((e) => path.extname(e) === ".srt")) {
            return res.status(200).json({ message: "no subtitles" });
          }

          var Subs = f.find((e) => e === "Subs");

          if (Subs) {
            fs.readdir(fullPath + "/Subs", (err, subs) => {
              forReadStream(subs, fullPath)
                .then((form) => {
                  res.setHeader("x-Content-Type", "multipart/form-data; boundary=" + form._boundary);
                  res.setHeader("Content-Type", "text/plain");
                  res.send(form);
                })
                .catch((error) => console.error(error));
            });
          } else {
            var srt = f.find((e) => path.extname(e) === ".srt");
            const subtitlePath = path.resolve(fullPath, srt);
            const subVTT = subtitlePath.replace(".srt", ".vtt");
            var newSub = fs.createReadStream(subtitlePath).pipe(srt2vtt()).pipe(fs.createWriteStream(subVTT));

            const job = new CronJob(
              "30 59 2 * * *", // Tous les jours a 03:00
              () => {
                newSub.close();
                console.log("streamsub stop");
              },
              null,
              true,
              "Europe/Paris"
            );

            job.start();

            newSub.on("finish", () => {
              res.set("Content-Type", "text/plain");
              return res.status(200).sendFile(subVTT);
            });
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server internal error" });
  }
};
