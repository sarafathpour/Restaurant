class ErrorResponse extends Error {
  constructor(
    message,
    statusCode = 500,
    field = null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.field = field;
  }
}

module.exports = ErrorResponse;
