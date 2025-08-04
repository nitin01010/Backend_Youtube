const express = require("express");
const router = express.Router();

const { handleAllVideos, handleCreateVideo, handleFindVideoById, handleCategory, handleSearch, handleComments, handleDelete, handleEdit, handleLike,  handleCreateChannel } = require("../controllers/youtube.controller");

// GET ALL VIDEOS
router.get("/", handleAllVideos);  

// WATCH BY VIDEO ID
router.post("/watch", handleFindVideoById);

// CREATE NEW VIDEO
router.post("/", handleCreateVideo);

// FIND BY CATEGORY
router.post("/category", handleCategory);

// FIND BY SEARCH KEYWORD
router.post("/search", handleSearch);

// COMMENTS CREATE 
router.post("/comments", handleComments);

// COMMENT DELETE 
router.post("/comment/delete", handleDelete);

// COMMENT EDIT BY ID 
router.post("/comment/edit", handleEdit);

//  CREATE CHANNLE
router.post("/video/like/increment", handleLike);
router.post("/create/channle", handleCreateChannel);


module.exports = router
