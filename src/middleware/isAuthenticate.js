const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');
require("dotenv").config();

const isAuthenticated = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'You must be logged in to view this resource.'
    });
  }

  const parts = authorizationHeader.split(" ");
  if (parts.length === 2 && parts[0] === "Bearer") {
    const token = parts[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Token not provided."
      });
    }

    try {
      let decoded;
      try {
        // First, try to verify the token using native JWT verification
        decoded = jwt.verify(token, process.env.JWT_KEY_SECRET);
      } catch (nativeError) {
        // If native JWT verification fails, try Google token verification
        try {
          
          const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`);
          decoded = response.data;
          // console.log("decoded", decoded);
          const user = await User.findOne({ googleId: decoded.sub });
          if (!user) {
            return res.status(404).json({
              success: false,
              message: "User not found."
            });
          }
          decoded.id = user._id;
        } catch (googleError) {
          // console.error("google error :", googleError.response);


          // If both verifications fail, check if the token is expired
          if (nativeError.name === 'TokenExpiredError' || googleError.response?.data?.error_description === 'Invalid value') {
            // Token is expired, return a status error to trigger refresh token logic in axiosInstance
            return res.status(403).json({
              success: false,
              message: "Unauthorized. Token expired."
            });
          } else {
            // console.error("Error verifying token:", googleError);
            return res.status(403).json({
              success: false,
              message: "Forbidden. Token verification failed."
            });
          }
        }
      }
      req.userId = decoded.id;
      return next();
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(403).json({
        success: false,
        message: "Forbidden. Token verification failed."
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid authorization header format."
    });
  }
};

module.exports = isAuthenticated;