const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { isYoutubeURL, extractVideoId } = require("./utils/youtube");

const app = express();
app.use(cors());
app.use(express.json());

//Home
app.get("/", (req, res) => {
  res.send("API is running!");
});

//test
app.get("/test/ping", (req, res) => {
  res.json({ message: "pong" });
});

//main summarize api
app.post("/api/summarize", async (req, res) => {
  const { url } = req.body;

  //1.Validate url
  if (!url || typeof url != 'string')
    return res.status(400).json({ error: "Invalid URL" });

  if (!isYoutubeURL(url))
    return res
      .status(400)
      .json({ error: "Currently only YouTube URLs are supported." });

  //Extract video id
  const videoId = extractVideoId(url);
  if (!videoId) return res.status(400).json({ error: "Invalid Youtube URL!" });

  // For now, just respond with videoId (test step)
  res.json({ summary: `Valid YouTube link! Video ID: ${videoId}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
