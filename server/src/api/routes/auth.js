const express = require("express");

const passport = require("../config/passport-config");

const {
  getSession,
  getGoogleRedirect,
  get42Redirect,
  getLoginFailed,
  getLogout,
} = require("../controllers/authController");

const { checkLoggedIn } = require("../utils/authHandler");

const router = express.Router();

const CLIENT_HOME_PAGE_URL = "http://localhost:3000";
const FAILURE_REDIRECT = "/api/v1/auth/login/failed";

//CHeck si l'utilisateur est connecté
router.get("/is_logged", checkLoggedIn, getSession);

//login failed
router.get("/login/failed", getLoginFailed);

// GOOGLE
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

// 42
router.get("/42", passport.authenticate("42"));

//CALLBACK GOOGLE
router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: FAILURE_REDIRECT,
    successRedirect: CLIENT_HOME_PAGE_URL,
  }),
);

//CALLBACK 42
router.get(
  "/42/redirect",
  passport.authenticate("42", {
    failureRedirect: FAILURE_REDIRECT,
    successRedirect: CLIENT_HOME_PAGE_URL,
  }),
);

//LOGOUT
router.get("/logout", checkLoggedIn, getLogout);

module.exports = router;
