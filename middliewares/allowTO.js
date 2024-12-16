

module.exports = (...roles) => {
    return (req, res, next) => {
      try {

       if (!roles.includes(req.currentUser.role)) {
          return res.status(403).json({ message: "Access denied. You do not have the required permissions." });
        }
  
        next();
      } catch (error) {
        
        console.error("Authorization middleware error:", error);
        next(error); 
      }
    };
  };
  