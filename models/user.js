const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  // status: {
  //   type: String,
  //   enum: ["active", "block", "inActive"],
  //   default: "active",
  //   required: true,
  // },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
  address: {
    type: String,
  },
}, {
  timestamps: true,
});

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  // just run for password modifications

  if (!this.isModified("password")) {
    next();
  }

  // generate salt
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({
    id: this._id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
// userSchema.methods.getSignedRefreshToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.REFRESH_EXPIRE,
//   });
// };

//match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// generate reset password token
userSchema.methods.getResetPasswordToken = function () {
  // generate the token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hash token and set to resetPasswordToken field
  this.keys.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //set expire
  this.keys.resetPasswordExpire = Date.now() + 100 * 60 * 1000;

  return resetToken;
};

// generate validate email token
userSchema.methods.getEmailVerifyToken = function () {
  // generate the token
  const verifyToken = crypto.randomBytes(20).toString("hex");

  // hash token and set to resetPasswordToken field
  this.keys.emailActivateKey = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  //set expire
  this.keys.emailActivateExpire = Date.now() + 100 * 60 * 1000;

  return verifyToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;