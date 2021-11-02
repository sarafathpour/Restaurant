const User = require('../../models/user');

exports.createUser = async function (req, res) {
  try {
    let user = await User.create({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    })
    res.status(201).json({
      success: true,
      data: user
    })
  } catch (error) {
    console.log(error);
  }
}