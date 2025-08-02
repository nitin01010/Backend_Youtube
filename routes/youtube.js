const express = require("express");
const router = express.Router();

const { handleAllVideos, handleCreateVideo, handleFindVideoById,handleCategory ,handleSearch, handleComments, handleDelete} = require("../controllers/youtube.controller");

router.get("/", handleAllVideos);
router.post("/", handleCreateVideo);
router.post("/watch", handleFindVideoById);
router.post("/category", handleCategory);
router.post("/search", handleSearch);
router.post("/comments", handleComments);
router.post("/comment/delete", handleDelete);


module.exports = router
