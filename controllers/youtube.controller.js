const youtubeCollection = require("../module/youtube.modul");


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


module.exports = {
    handleAllVideos,
    handleCreateVideo,
    handleFindVideoById,
    handleCategory,
    handleSearch
}