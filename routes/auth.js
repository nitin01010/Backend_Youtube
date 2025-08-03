const express = require("express");
const router = express.Router();
const handleAuth = require("../controllers/auth.controller");

//  IS VALID USER OR NOT 
router.get("/", handleAuth);

module.exports = router