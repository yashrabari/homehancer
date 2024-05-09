const jwt  = require('jsonwebtoken')
require("dotenv").config();

const generateOTP = () => {
  const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  return otp.toString();
};

const generateJwtToken = (id,user_type) => {
  return jwt.sign({ id,user_type }, "home_hancer_jwt_secret_key", { expiresIn: "1d" });
}

const verifyJwtToken = (token) => {
  var bearer = token.split(" ");
  return jwt.verify(bearer[1], "home_hancer_jwt_secret_key");
  
}


module.exports = {
    generateOTP,
    generateJwtToken,
    verifyJwtToken
}