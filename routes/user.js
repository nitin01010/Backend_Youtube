const express = require("express");
const router = express.Router();

const { handleRegister, handleLogin } = require("../controllers/user.controller");

// CREATE USER 
router.post("/register", handleRegister);

// LOGIN USER
router.post("/login", handleLogin);

module.exports = router
