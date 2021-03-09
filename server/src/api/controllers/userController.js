const fs = require("fs");
const extpath = require("path");

const { validateSignupInputs, validateNewPasswordInputs } = require("../utils/inputsValidator");
const { sendSignUpMail, sendResetPasswordMail } = require("../utils/sendMail");
const authHandler = require("../utils/authHandler");
const passport = require("../config/passport-config");
const User = require("../models/User");

// Recupere tout les utilisateurs
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.getUsers();
    const result = users.map((user) => {
      return {
        language: user.language,
        username: user.username,
        imgProfile: user.imgProfile === "" ? "/img/img-default.jpg" : user.imgProfile,
      };
    });
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err });
  }
};

// Mettre a jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const user = req.user;
    const user_id = user._id;
    const body = req.body;
    await User.updateUser(user_id, body);
    return res.status(200).json({ status: "success", message: "profile modifié avec succes" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: error });
  }
};

// Supprime un utilisateur
exports.deleteUser = (request, response, next) => {
  console.log(request.user);
  return response.status(200).json("OK");
};

// Connecte un utilisateur inscrit
exports.postLogin = (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status

    if (!user) {
      return res.send({
        status: "error",
        message: "Wrong username or password",
      });
    }
    if (user.vkey) {
      return res.send({
        status: "error",
        message: "Your account is not activated yet",
      });
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.send({
        status: "success",
        message: "authentication succeeded",
        user,
      });
    });
  })(req, res, next);
};

// Mets a jour la langue par defaut de l'utilisateur
exports.updateLanguage = async (req, res) => {
  try {
    const user = req.user;
    const user_id = user._id;
    user.language = req.params.language;
    await User.updateUser(user_id, user);
    return res.status(200).json({ status: "success", message: "langue changé avec succes" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

//Recupere un utilisateur via son login

exports.getUserByLogin = async (req, res, next) => {
  try {
    const { userLogin } = req.params;
    const user = await User.findUserByUsername(userLogin);
    if (!user) return res.status(404).json({ status: "error", message: "Utilisateur introuvable" });
    const result = {
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      imgProfile: user.imgProfile,
    };
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
};

// Recupere un utilisateur via son ID
exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findUserById(userId);
    if (!user) return res.status(200).json({ status: "error", message: "Utilisateur introuvable" });
    const result = {
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      imgProfile: user.imgProfile,
    };
    return res.status(200).json({ status: "success", user: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: JSON.stringify(error) });
  }
};

// Creer un utilisateur
exports.createUser = async (req, res, next) => {
  let { email, username } = req.body;
  //CHECK SIGNUP INPUTS
  let errors = await validateSignupInputs(req);
  if (!errors.isEmpty()) return res.send(errors);

  let errorsPassword = await validateNewPasswordInputs(req);
  if (!errorsPassword.isEmpty()) return res.send(errorsPassword);

  const userEmailExist = await User.findUserByEmail(email);
  const userUsernameExist = await User.findUserByUsername(username);

  //CHECK IF USER EXIST IN DB
  if (userEmailExist || userUsernameExist) {
    return res.status(200).json({
      status: "error",
      message: "Username or email already exist",
    });
  }

  const newUser = await User.insertUser(req.body);
  if (!newUser) {
    return res.send({
      status: "error",
      message: "Erreur lors de l'inscription de l'utilisateur",
    });
  }

  const user = await User.findUserByUsername(username);
  const validationToken = user.vkey; //get validation token to insert in sendMail

  sendSignUpMail(email, username, validationToken);

  return res.send({
    status: "success",
    message: `${username} a bien été inscrit`,
  });
};

exports.activateUser = async (req, res, next) => {
  const username = req.body.search.split("&")[0].split("=")[1];
  const urlToken = req.body.search.split("&")[1].split("=")[1];
  const user = await User.findUserByUsername(username);
  if (user) {
    const bddToken = user.vkey;
    if (urlToken === bddToken) {
      User.updateUser(user.id, { vkey: "" });
      res.send({ status: "success", message: "Account activated !" });
    } else {
      return res.send({ status: "error", message: "incorrect token" });
    }
  } else {
    return res.send({ status: "error", message: "incorrect username" });
  }
};

exports.resetPasswordEmail = async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findUserByEmail(email);

  if (email) {
    if (user) {
      let fkey;
      fkey = await authHandler.generateToken(user); //génère un token pour reset le password
      User.updateUser(user.id, { fkey: fkey });
      sendResetPasswordMail(email, fkey);
      return res.send({
        status: "success",
        message: "A reset email has been sent to you",
      });
    } else {
      return res.send({
        status: "error",
        message: "This email is not registered",
      });
    }
  }
};

//CHECK IF THE USER IS ALLOWED ON RESET PASSWORD PAGE
exports.resetPasswordPage = async (req, res, next) => {
  const email = req.body.search.split("&")[0].split("=")[1];
  const urlToken = req.body.search.split("&")[1].split("=")[1];
  const user = await User.findUserByEmail(email);

  if (user) {
    const bddForgotToken = user.fkey;
    if (urlToken === bddForgotToken) {
      //TOKEN CORRECT
      return res.send({ status: "success" });
    } else {
      //TOKEN INCORRECT
      return res.send({ status: "error" });
    }
  } else {
    return res.send({ status: "error" });
  }
};

exports.resetPassword = async (req, res, next) => {
  const { newPassword, confirmNewPassword } = req.body.password;
  const email = req.body.url.search.split("&")[0].split("=")[1];
  const user = await User.findUserByEmail(email);

  if (!user.password) return res.status(200).json({ status: "error", message: "You are registered via google or 42" });

  if (!newPassword || !confirmNewPassword) {
    return res.send({
      status: "error",
      message: "please fill in all inputs",
    });
  }

  if (!new RegExp(/^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/).test(newPassword)) {
    return res.send({
      status: "error",
      message: "Must contain 8 characters, 1 letter, 1 number and 1 special character",
      param: "newPassword",
    });
  }

  if (newPassword !== confirmNewPassword) {
    return res.send({
      status: "error",
      message: "Passwords don't match",
      param: "confirmNewPassword",
    });
  }

  let hashedPassword = null;
  hashedPassword = await authHandler.hashPassword(newPassword);
  await User.updateUser(user._id, { password: hashedPassword });
  return res.send({
    status: "success",
    message: "Password has been modified",
  });
};

exports.editPassword = async (req, res, next) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  if (!req.user.password)
    return res.status(200).json({ status: "error", message: "You are registered via google or 42" });

  if (await authHandler.comparePassword(req.user.password, oldPassword)) {
    if (!new RegExp(/^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/).test(newPassword)) {
      return res.send({
        status: "error",
        message: "Must contain 8 characters, 1 letter, 1 number and 1 special character",
        param: "newPassword",
      });
    }
    if (newPassword === confirmNewPassword) {
      let hash = await authHandler.hashPassword(newPassword);
      User.updateUser(req.user.id, { password: hash });
      return res.send({
        status: "success",
        message: "Your password has been modified",
      });
    }
    return res.send({
      status: "error",
      message: "passwords do not match",
      param: "newPassword",
    });
  }
  return res.send({
    status: "error",
    message: "Wrong old password",
    param: "oldPassword",
  });
};

exports.editProfil = async (req, res, next) => {
  const { imgProfile, firstname, lastname, username, email, language } = req.body;
  if (email !== req.user.email && !req.user.password)
    return res.send({
      status: "error",
      message: "You are logged via google or 42, you can't modify your email",
    });

  if (
    imgProfile !== req.user.imgProfile ||
    firstname !== req.user.firstname ||
    lastname !== req.user.lastname ||
    username !== req.user.username ||
    email !== req.user.email ||
    language !== req.user.language
  ) {
    User.updateUser(req.user.id, {
      imgProfile: imgProfile !== req.user.imgProfile ? imgProfile : req.user.imgProfile,
      firstname: firstname !== req.user.firstname ? firstname : req.user.firstname,
      lastname: lastname !== req.user.lastname ? lastname : req.user.lastname,
      username: username !== req.user.username ? username : req.user.username,
      email: email !== req.user.email ? email : req.user.email,
      language: language !== req.user.language ? language : req.user.language,
    });
    return res.send({
      status: "success",
      message: "Your profile has been edited",
    });
  }
  return res.send({
    status: "error",
    message: "You haven't changed anything",
  });
};

exports.uploadImg = (req, res) => {
  const image = req.files?.img;
  if (!image) return res.status(200).json({ status: "success", message: "image not changed" });
  const username = req.body.username;
  var type = extpath.extname(`${req.files.img.name}`);
  const path = `/photos/${username}`;

  const jpg = `../client/public${path}` + ".jpg";
  const jpeg = `../client/public${path}` + ".jpeg";
  const png = `../client/public${path}` + ".png";

  if (fs.existsSync(jpg)) fs.unlinkSync(jpg);
  else if (fs.existsSync(jpeg)) fs.unlinkSync(jpeg);
  else if (fs.existsSync(png)) fs.unlinkSync(png);

  image.mv(`../client/public/photos/${req.body.username}${type}`, (err) => {
    if (err) {
      console.log(err);
    } else {
      User.updateUserByUsername(username, { imgProfile: `/photos/${username}${type}` });
      res.send({
        status: "success",
      });
    }
  });
};
