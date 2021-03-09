const errorHandler = (res, statusCode, param, msg) => {
  return res.status(statusCode).json({
    status: statusCode,
    param: param,
    message: msg,
  });
};

module.exports = errorHandler;
