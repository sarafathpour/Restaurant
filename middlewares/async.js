const asyncHandler = fn => (req, res, next, additional = null) =>
    Promise.resolve(fn(req, res, next, additional)).catch(next);

module.exports = asyncHandler;
