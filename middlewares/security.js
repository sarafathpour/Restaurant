const User = require('../models/user');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return next(
            new ErrorResponse(
                'Not authorize to access this route. need authorization',
                401,
                'token'
            )
        );
    }

    try {
        // verify token
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        let user = await User.findById(decode.id);
        if (!user) {
            return next(
                new ErrorResponse(
                    'Not authorize to access this route. user not found',
                    401,
                    'token'
                )
            );
        }

        //add user to the req
        req.user = user;

        next();
    } catch (err) {
        return next(
            new ErrorResponse(
                'Not authorize to access this route. token expired',
                401,
                'token'
            )
        );
    }
};

// Grant Access to specific roles
exports.permit = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `user role ${req.user.role} is not authorized to access this route`,
                    403,
                    'token'
                )
            );
        }
        next();
    };
};
