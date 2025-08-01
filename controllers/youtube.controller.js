const youtubeCollection = require("../module/youtube.modul");


async function handleAllVideos(req,res){
    try {
        const Youtube = await youtubeCollection.find({});
        res.status(200).json({message:'fetch all vidoes',data:Youtube});
    } catch (error) {
        res.status(400).json({message:'video not fetch ',error});
    }
}


async function handleCreateVideo(req,res){
    try {
        const newVideo = await youtubeCollection.create(req.body);
        res.status(201).json({message:'Video Created',data:newVideo});
    } catch (error) {
        res.status(400).json({message:'fail to create video ....',error});
    }
}


module.exports = {
    handleAllVideos,
    handleCreateVideo
}