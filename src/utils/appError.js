class AppError{
  message;
  statusCode = 400;
  construtor(message, statusCode){
    this.message = message;
    this.statusCode = statusCode;
  };
};

module.exports = AppError;