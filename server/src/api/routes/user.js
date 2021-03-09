const express = require("express");
const passport = require("../config/passport-config");

//import model
const User = require("../models/User");

//import controllers
const {
  getAllUsers,
  getUserByLogin,
  getUserById,
  updateUser,
  deleteUser,
  postLogin,
  updateLanguage,
  createUser,
  activateUser,
  resetPasswordEmail,
  resetPasswordPage,
  resetPassword,
  editPassword,
  editProfil,
  uploadImg,
} = require("../controllers/userController");

const { checkLoggedIn } = require("../utils/authHandler");
const router = express.Router();

//GET ALL THE USERS
router.get("/", getAllUsers);

router.get("/:userLogin", checkLoggedIn, getUserByLogin);

//GET SPECIFIC USER IN DB BY ID
router.get("/id/:userId", checkLoggedIn, getUserById);

// UPDATE USER
router.patch("/", checkLoggedIn, updateUser);

//DELETE A USER
router.delete("/:userId", deleteUser);

//LOGIN A USER
router.post("/signin", postLogin);

router.patch("/language/:language", checkLoggedIn, updateLanguage);

//SIGNUP USER IN DB
router.post("/signup", createUser);
//UPLOAD USER IMAGE IN DB
router.post("/uploadImg", uploadImg);
//ACTIVATE USER ACCOUNT
router.post("/activateUser", activateUser);
//RESET PASSWORD EMAIL
router.post("/resetPasswordEmail", resetPasswordEmail);
//CHECK IF THE USER IS ALLOWED ON RESET PASSWORD PAGE
router.post("/resetPasswordPage", resetPasswordPage);
//RESET PASSWORD
router.post("/resetPassword", resetPassword);
//EDIT PASSWORD
router.post("/editPassword", editPassword);
//EDIT PROFIL
router.post("/editProfil", editProfil);
module.exports = router;
