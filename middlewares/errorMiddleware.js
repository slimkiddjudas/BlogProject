export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
      success: false,
      message: "Requested resource not found",
      path: req.originalUrl
    });
};

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    
    // Hata detaylarını hazırla
    const errorResponse = {
      success: false,
      message: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
    };
  
    // Eğer development ortamındaysak hata detaylarını göster
    if (process.env.NODE_ENV !== "production") {
      console.error(err);
    }
  
    res.status(statusCode).json(errorResponse);
  };
