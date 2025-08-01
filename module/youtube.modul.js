const mongoose = require("mongoose");

const YoutubeSchema = new mongoose.Schema({
    videoId: {
        type: String,
        required: true
    },
    title: String,
    thumbnailUrl: String,
    description: String,
    channelId: String,
    uploader: String,
    views: Number,
    likes: Number,
    dislikes: Number,
    uploadDate: Date,
    comments: [
        {
            commentId: String,
            userId: String,
            text: String,
            timestamp: Date
        }
    ]
});

const youtubeCollection = mongoose.model("Youtube", YoutubeSchema);
module.exports = youtubeCollection;