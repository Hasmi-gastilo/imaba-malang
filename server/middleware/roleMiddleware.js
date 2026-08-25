/**
 * Middleware to check user role
 * @param {Array} allowedRoles - Array of allowed roles
 */
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. User not authenticated.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Anda tidak memiliki akses ke resource ini.'
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
