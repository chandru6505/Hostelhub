const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode,
      message: message,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    }
  });
};

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 404,
      message: `Route ${req.originalUrl} not found`,
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = { errorHandler, notFoundHandler };
