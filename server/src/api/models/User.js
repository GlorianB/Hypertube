const mongoose = require("mongoose");
const authHandler = require("../utils/authHandler");

require("dotenv").config();

const UserSchema = mongoose.Schema({
  lastname: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  imgProfile: {
    type: String,
  },
  password: {
    type: String,
  },
  language: {
    type: String,
    default: "en",
    required: true,
  },
  vkey: {
    type: String,
  },
  fkey: {
    type: String,
  },
  history: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Movie",
    },
  ],
});

// Récupérer tout les utilisateurs
UserSchema.statics.getUsers = async function () {
  try {
    const users = await this.model("User").find().exec();
    return users;
  } catch (error) {
    console.error(`User model: ${error}`);
  }
};

// Insérer un nouvel utilisateur
UserSchema.statics.insertUser = async function (userData) {
  try {
    let hashedPassword = null;
    let vkey = "";
    if (userData.password) hashedPassword = await authHandler.hashPassword(userData.password);
    if (userData.password) vkey = await authHandler.generateToken(userData);
    const user = {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      firstname: userData.firstname,
      lastname: userData.lastname,
      imgProfile: `/img/img-default.jpg`,
      language: userData.language ? userData.language : "fr",
      vkey: vkey,
      history: [],
    };

    const newUser = new this(user);
    const result = await newUser.save();
    return result;
  } catch (error) {
    console.error(`User model insertUser: ${error}`);
  }
};

// Update un utilisateur
UserSchema.statics.updateUser = async function (userId, userData) {
  try {
    const result = await this.model("User").findByIdAndUpdate(userId, userData).exec();
    return result;
  } catch (error) {
    console.error(`User model: ${error}`);
  }
};
// Update un utilisateur via son username
UserSchema.statics.updateUserByUsername = async function (userName, userData) {
  try {
    const result = await this.model("User").updateOne({ username: userName }, { $set: userData }).exec();
    return result;
  } catch (error) {
    console.error(`User model: ${error}`);
  }
};

// Récupérer un utilisateur via son id
UserSchema.statics.findUserById = async function (userId) {
  try {
    const result = await this.model("User").findById(userId).exec();
    return result;
  } catch (error) {
    console.error(`User model: ${error}`);
  }
};

// Récupérer un utilisateur via son username
UserSchema.statics.findUserByUsername = async function (userUsername) {
  try {
    const result = await this.model("User").findOne({ username: userUsername }).exec();
    return result;
  } catch (error) {
    console.error(`User model: ${error}`);
  }
};

// Récupérer un utilisateur via son email
UserSchema.statics.findUserByEmail = async function (userEmail) {
  try {
    const result = await this.model("User").findOne({ email: userEmail }).exec();
    return result;
  } catch (error) {
    console.error(`User model: ${error}`);
  }
};

// Supprimer un utilisateur
UserSchema.statics.deleteUser = async function (userId) {
  try {
    const result = await this.model("User").findByIdAndRemove(userId).exec();
    return result;
  } catch (error) {
    console.error(`User model: ${error}`);
  }
};

// Supprimer tout les utilisateurs
UserSchema.statics.removeUsers = async function () {
  try {
    const result = this.model("User").deleteMany().exec();
    return result;
  } catch (error) {
    console.error(`User model: ${error}`);
  }
};

const User = mongoose.model("User", UserSchema, "User");

module.exports = User;
