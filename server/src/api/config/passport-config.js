const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FortyTwoStrategy = require("passport-42").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const { comparePassword } = require("../../api/utils/authHandler");

const User = require("../models/User");
require("dotenv").config();

const strategyOptionsGoogle = {
  clientID: process.env.OAUTH_GOOGLE_CLIENT_ID,
  clientSecret: process.env.OAUTH_GOOGLE_CLIENT_PASSWORD,
  callbackURL: "http://localhost:5000/api/v1/auth/google/redirect",
};

const strategyOptions42 = {
  clientID: process.env.OAUTH_42_CLIENT_ID,
  clientSecret: process.env.OAUTH_42_CLIENT_PASSWORD,
  callbackURL: "http://localhost:5000/api/v1/auth/42/redirect",
};

// Callback qui s'apelle au moment ou on selectionne une adresse gmail valide lors de oauth
const verifyCallbackGoogle = async (accessToken, refreshToken, profile, done) => {
  try {
    const google_user = profile._json;
    const { name, given_name, family_name, email, picture, locale } = google_user;
    const user = await User.findUserByEmail(email);
    if (user) {
      if (!user.password) return done(null, user);
      await User.deleteUser(user);
    }
    const newUser = new User({
      username: name,
      email,
      password: null,
      firstname: given_name,
      lastname: family_name,
      imgProfile: picture,
      language: locale,
    });
    await User.insertUser(newUser);
    done(null, newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
};

const verifyCallback42 = async (accessToken, refreshToken, profile, done) => {
  try {
    const user_42 = profile._json;
    const { login, first_name, last_name, email, image_url, campus } = user_42;
    // console.log(login, first_name, last_name, email, image_url, campus[0].language.identifier);
    const user = await User.findUserByEmail(email);
    if (user) return done(null, user);
    const newUser = new User({
      username: login,
      email,
      password: null,
      firstname: first_name,
      lastname: last_name,
      imgProfile: image_url,
      language: campus[0].language.identifier,
    });

    await User.insertUser(newUser);
    console.log("user inserted");
    done(null, newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findUserById(id).then((user) => {
    done(null, user);
  });
});

passport.use(new GoogleStrategy(strategyOptionsGoogle, verifyCallbackGoogle));
passport.use(new FortyTwoStrategy(strategyOptions42, verifyCallback42));
passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await User.findUserByUsername(username);
    if (!user) {
      return done(null, false);
    }
    if (!(await comparePassword(user.password, password))) {
      return done(null, false);
    }
    return done(null, user);
  }),
);

module.exports = passport;
