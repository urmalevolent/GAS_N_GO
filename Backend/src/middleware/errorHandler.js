/**
 * Middleware penanganan error global Express
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error(`[Error Handler] ${err.message}`);
  if (err.stack && process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal pada server.',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
