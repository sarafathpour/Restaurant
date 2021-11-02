const errorResponse = require("@utils/errorResponse");
const asyncHandler = require("@middlewares/async");
const User = require('@models/user');

exports.register = asyncHandler (async (req, res, next) => {
    const { password, email } = req.body;   
    const user = await User.create({
      password,
      email
    });
    sendTokenResponse(user, 201, res);
});

exports.login = asyncHandler(async(req, res, next) => {
  const { email, password } = req.body;  
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new errorResponse("email or password is wrong", 401))
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new errorResponse("email or password is wrong", 401))
  }
  sendTokenResponse(user, 200, res);
});

exports.getMe = asyncHandler(async(req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  // const refreshToken = user.getSignedRefreshToken();
  const role = user.role;
  const _id = user._id;
  const environment = process.env.NODE_ENV;

  res.status(statusCode).json({
    success: true,
    data: {
      token,
      role,
      _id,
      environment,
    },
  });
};
