const { body, param } = require("express-validator");
const User = require("@models/user");
const loginValidation = () => {
  return [
    body("username")
      .exists()
      .withMessage("field is required")
      .trim()
      .isEmail()
      .withMessage("should be email")
      .normalizeEmail({ all_lowercase: true }),
    body("password")
      .exists()
      .withMessage("field is required")
      .isString()
      .withMessage("field must be string"),
  ];
};
const registerValidation = () => {
  return [
    body("email")
      .exists()
      .withMessage("field is required")
      .trim()
      .isEmail()
      .withMessage("should be email")
      .normalizeEmail({ all_lowercase: true })
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) return Promise.reject("E-mail already in use");
        });
      }),
    body("password")
      .exists()
      .withMessage("field is required")
      .isString()
      .withMessage("field must be string"),
  ];
};
const refreshValidation = () => {
  return [
    body("refreshToken")
      .exists()
      .withMessage("field is required")
      .trim()
      .isString()
      .withMessage("should be string"),
    body("fireBase")
      .optional()
      .trim()
      .isString()
      .withMessage("field must be string"),
    body("panelFireBase")
      .optional()
      .trim()
      .isString()
      .withMessage("field must be string"),
  ];
};
module.exports = {
  loginValidation,
  registerValidation,
  refreshValidation,
};
