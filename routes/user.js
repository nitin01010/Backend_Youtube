const express = require("express");
const router = express.Router();
const { handlegetAllUser, handleRegister, handleLogin, handleDeleteByid } = require("../controllers/user.controller");

router.get("/",handlegetAllUser);
router.post("/register", handleRegister);
router.post("/login",handleLogin);
router.delete("/:id",handleDeleteByid);

module.exports = router
