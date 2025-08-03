const express = require("express");
const router = express.Router();
const { getTestRoute } = require("../controllers/test.controller");

// TEST ROUTE FOR EVERYONE
router.get("/", getTestRoute);


module.exports = router