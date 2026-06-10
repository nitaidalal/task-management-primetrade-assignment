const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next); // passes error to errorMiddleware
};

export default asyncHandler;
