const mongoose = require("mongoose");

const { Schema } = mongoose;
const MovieSchema = new Schema({
  movie_id: {
    type: Number,
    required: true,
  },
  comments: [
    {
      user_login: {
        type: String,
        required: true,
      },
      user_photo: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    },
  ],
});

//Recuperer un film et ses commentaires via l'id du film
MovieSchema.statics.getMovie = async function (movie_id) {
  try {
    const movie = await this.model("Movie").findOne({ movie_id }).exec();
    return movie;
  } catch (error) {
    console.error(`Movie model: ${error}`);
  }
};

//Inserer/Mettre a jour un film et ses commentaires
MovieSchema.statics.insertMovie = async function (movieData) {
  try {
    const movie = { comments: movieData.comments };
    const result = await this.model("Movie").findOneAndUpdate({ movie_id: movieData.id }, movie, {
      new: true,
      upsert: true,
    });
    return result;
  } catch (error) {
    console.error(`Movie model: ${error}`);
  }
};

//Supprimer un film et ses commentaires via l'id du film
MovieSchema.statics.deleteMovie = async function (movie_id) {
  try {
    const result = await this.model("Movie").findByIdAndRemove(movie_id).exec();
    return result;
  } catch (error) {
    console.error(`Movie model: ${error}`);
  }
};

//Mettre a jour un film et ses commentaires via l'id du film
MovieSchema.statics.updateMovie = async function (movie_id, movieData) {
  try {
    const result = await this.model("Movie").findByIdAndUpdate(movie_id, movieData).exec();
    return result;
  } catch (error) {
    console.error(`Movie model: ${error}`);
  }
};

const Movie = mongoose.model("Movie", MovieSchema, "Movie");

module.exports = Movie;
