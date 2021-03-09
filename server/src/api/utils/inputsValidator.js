const { check, validationResult } = require("express-validator");

const validateSignupInputs = async (req) => {
  await check("firstname", "firstname is not valid").isLength({ min: 1 }).run(req);
  await check("lastname", "lastname is not valid").isLength({ min: 1 }).run(req);
  await check("username", "username is not valid").isLength({ min: 4 }).run(req);
  await check("email", "email is not valid").isEmail().run(req);

  const errors = validationResult(req);

  return errors;
};

const validateNewPasswordInputs = async (req) => {
  await check(
    "password",
    "password should contain at least 8 characters, 1 lower case, 1 upper case and 1 special character",
  )
    .isLength({ min: 8 })
    .matches(/^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/, "i")
    .run(req);
  await check("confirmPassword", "Passwords don't match")
    .custom((value, { req, loc, path }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match");
      } else {
        return value;
      }
    })
    .run(req);

  const errors = validationResult(req);

  return errors;
};

module.exports = { validateSignupInputs, validateNewPasswordInputs };
