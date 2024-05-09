const User = require("../Models/UserModel");
const OTP = require("../Config/OTP-Generate");

const registerUser = async (req, res) =>{
    try {
        const { mobile } = req.body;
        const otp = OTP.generateOTP();
        const user = await User.create({ mobile, otp,userType: "Electrician" });
  
        res.status(201).json({ message: 'User signed up successfully', userId: user.id, user});
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during user signup' });
      }
}


const verifyOTP = async (req, res) =>{
    try {
      const { mobile, otp } = req.body;
      const user = await User.findOne({ where: { mobile, otp } });

      if (!user) {
        return res.status(404).json({ error: 'Invalid OTP' });
      }
    //   user.otp = null;
      await user.save();

      res.status(200).json({ message: 'OTP verified successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred during OTP verification' });
    }
  }


const loginUser =   async (req, res) =>{
    try {
      const { mobile } = req.body;
      const user = await User.findOne({ where: { mobile } });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'User logged in successfully', userId: user.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred during user login' });
    }
  }

  const getAllUser = (req, res) =>{
    try {
      
    } catch (error) {
      
    }
  }

  module.exports ={
    registerUser,
    verifyOTP,
    loginUser,
    getAllUser
  }