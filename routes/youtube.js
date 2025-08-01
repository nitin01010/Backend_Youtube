const express = require("express");
const router = express.Router();

const { handleAllVideos, handleCreateVideo } = require("../controllers/youtube.controller");

router.get("/", handleAllVideos);
router.post("/", handleCreateVideo);


module.exports = router
