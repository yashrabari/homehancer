const express = require("express");
const { registerUser, verifyOTP, loginUser, getAllUser } = require("../Controller/UserCtrl");
const router = express.Router();

router.post("/register", registerUser);
router.post("/otp", verifyOTP);
router.post("/login", loginUser);
router.get("/users", getAllUser);
// router.get("/user/:id", getbyID);
// router.delete("/user/:id", deleteUser);

module.exports = router;