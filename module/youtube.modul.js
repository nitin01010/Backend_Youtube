const mongoose = require("mongoose");

const YoutubeSchema = new mongoose.Schema({
    videoId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    thumbnailUrl: {
        type: String,
        required: [true, 'Thumbnail URL is required'],
    },
    description: String,
    channelId: String,
    views: Number,
    likes: Number,
    dislikes: Number,
    uploadDate: Date,
    subscribers: String,
    Avg: String,
    category: String,
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