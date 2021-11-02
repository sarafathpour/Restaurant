const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    // Log to console for developer
    if (err.message) {
        console.log(err.message.red);
    }
    let errorArray = [];
    let additionalTranslationKeys = {};
    let statusCode = 500;

    let error = {
        field: null,
        message: err.message
    };

    switch (err.name) {
        case 'MongoError':
            if (err.code === 11000) {
                let field = Object.keys(err.keyPattern)[0];
                let value = err.keyValue[field];
                error.message = 'Resource got duplicated';
                error.field = field;
                additionalTranslationKeys.field = field;
                additionalTranslationKeys.value = value;
                statusCode = 400;
                errorArray.push({
                    message: 'Resource got duplicated',
                    field: field
                });
            }
            break;
        case 'ValidationError':
            errorArray = Object.values(err.errors).map(function (item) {
                return {
                    message: item.message,
                    field: item.path
                };
            });
            break;
        case 'CastError':
            errorArray.push({
                'message': 'invalid cast'
            });
            additionalTranslationKeys.from = err.path;
            additionalTranslationKeys.to = err.kind;
            statusCode = 400;
            break;
        case 'Error':
            errorArray.push({
                message: err.message,
                field: err.field ? err.field : undefined
            });
            additionalTranslationKeys = err.additionalTranslationKeys;
            statusCode = err.statusCode || 500;
            break;
        case 'SyntaxError':
            errorArray.push({
                message: 'Unexpected string in JSON',
            });
            statusCode = err.statusCode;
            break;
        default:
            console.log(err.name);
            console.log(err);
            errorArray.push({
                message: 'Internal Server Error ',
                field: null,
                trace: {
                    name: err.name,
                    message: err.message
                }
            });
            break;
    }
    for (let i = 0; i < errorArray.length; i++) {
        if (res.__) {
            errorArray[i].message = res.__(errorArray[i].message, additionalTranslationKeys);
        }
    }

    res.status(statusCode).json({
        success: false,
        errors: errorArray
    });
};

module.exports = errorHandler;
