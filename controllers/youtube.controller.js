const User = require("../module/users.modules");
const youtubeCollection = require("../module/youtube.modul");
const jwt = require("jsonwebtoken");

async function handleAllVideos(req, res) {
    try {
        const Youtube = await youtubeCollection.find({});
        res.status(200).json({ message: 'fetch all vidoes', data: Youtube });
    } catch (error) {
        res.status(400).json({ message: 'video not fetch ', error });
    }
}

async function handleCreateVideo(req, res) {
    try {
        const newVideo = await youtubeCollection.create(req.body);
        res.status(201).json({ message: 'Video Created', data: newVideo });
    } catch (error) {
        res.status(400).json({ message: 'fail to create video ....', error });
    }
}

async function handleFindVideoById(req, res) {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Video ID is required" });
        }

        const findedVideo = await youtubeCollection.findOne({ videoId: id });

        if (!findedVideo) {
            return res.status(404).json({ message: "Video not found" });
        }

        res.status(200).json({ message: "Video found by ID", data: findedVideo });
    } catch (error) {
        res.status(500).json({ message: "Failed to find video", error: error.message });
    }
}

async function handleCategory(req, res) {
    try {
        const { category } = req.body;
        let videos;
        if (category === "all") {
            videos = await youtubeCollection.find({})
        } else {
            videos = await youtubeCollection.find({ category })
        }
        res.status(200).json({ success: true, data: videos });
    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

async function handleSearch(req, res) {
    try {
        const { search } = req.body;

        if (!search || typeof search !== 'string') {
            return res.status(400).json({ error: 'Search term is required and must be a string.' });
        }

        const searchItem = await youtubeCollection.find({
            title: { $regex: search, $options: 'i' } // case-insensitive search
        });


        return res.status(200).json(searchItem);
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

async function handleComments(req, res) {
    try {
        const { comments, authToken, videoId } = req.body;

        if (!comments || !authToken || !videoId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        const userId = decoded._id || decoded.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newComment = {
            userId: user._id,
            userName: user.username,
            text: comments,
            timestamp: new Date()
        };

        const updatedVideo = await youtubeCollection.findOneAndUpdate(
            { videoId },
            { $push: { comments: newComment } },
            { new: true }
        );

        if (!updatedVideo) {
            return res.status(404).json({ message: "Video not found" });
        }

        res.status(200).json({
            message: "Comment added",
        });

    } catch (error) {
        console.error("Error in handleComments:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function handleDelete(req, res) {
  try {
    const { videoId, commentId, userId, authToken } = req.body;

    // 1. Validate input
    if (!videoId || !commentId || !userId || !authToken) {
      return res.status(400).json({ message: 'Missing required fields: videoId, commentId, userId, or authToken' });
    }

    // 2. Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 3. Decode and verify token
    let decodedUser;
    try {
      decodedUser = jwt.verify(authToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // 4. Check permission: only allow deleting own comment
    if (decodedUser.id !== userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this comment' });
    }

    // 5. Delete the comment
    const result = await youtubeCollection.updateOne(
      {
        videoId,
        'comments._id': commentId,
        'comments.userId': userId,
      },
      {
        $pull: { comments: { _id: commentId } },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        message: 'Comment not found or already deleted',
      });
    }

    // 6. Success response
    res.status(200).json({ message: 'Comment deleted successfully' });

  } catch (err) {
    console.error('Delete comment error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}


async function handleEdit(req, res) {
  try {
    const { videoId, commentId, userId, authToken, updatedText } = req.body;

    if (!videoId || !commentId || !userId || !authToken || !updatedText) {
      return res.status(400).json({
        message: 'Missing required fields: videoId, commentId, userId, authToken, or updatedText'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let decodedUser;
    try {
      decodedUser = jwt.verify(authToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    if (decodedUser.id !== userId) {
      return res.status(403).json({ message: 'You do not have permission to edit this comment' });
    }

    const result = await youtubeCollection.updateOne(
      {
        videoId,
        'comments._id': commentId,
        'comments.userId': userId,
      },
      {
        $set: {
          'comments.$.text': updatedText,
          'comments.$.timestamp': new Date(), 
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        message: 'Comment not found or not updated',
      });
    }

    res.status(200).json({ message: 'Comment updated successfully' });

  } catch (err) {
    console.error('Edit comment error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}


async function handleLike(req, res) {
  try {
    const { videoId, userId } = req.body;

    if (!videoId || !userId) {
      return res.status(400).json({ message: "videoId and userId are required" });
    }

    const video = await youtubeCollection.findOne({ videoId });
    const user = await User.findById(userId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize arrays if they don't exist
    if (!user.likedVideos) user.likedVideos = [];
    if (!video.likedBy) video.likedBy = [];

    const alreadyLiked = user.likedVideos.includes(videoId);

    if (alreadyLiked) {
      // Unlike: remove videoId from user and userId from video
      user.likedVideos = user.likedVideos.filter(id => id !== videoId);
      video.likedBy = video.likedBy.filter(id => id !== userId);
      video.likes = Math.max(0, video.likes - 1); // Prevent negative likes

      await user.save();
      await video.save();

      return res.status(200).json({ message: "Video unliked successfully" });
    } else {
      // Like: add videoId to user and userId to video
      user.likedVideos.push(videoId);
      video.likedBy.push(userId);
      video.likes = (video.likes || 0) + 1;

      await user.save();
      await video.save();

      return res.status(200).json({ message: "Video liked successfully" });
    }

  } catch (error) {
    console.error("Error liking video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}



module.exports = {
    handleAllVideos,
    handleCreateVideo,
    handleFindVideoById,
    handleCategory,
    handleSearch,
    handleComments,
    handleDelete,
    handleEdit,
    handleLike,
}