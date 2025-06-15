const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { isYoutubeURL, extractVideoId } = require("./utils/youtube");
const {YoutubeLoader} = require("@langchain/community/document_loaders/web/youtube");
const { OpenAI } = require("openai"); //AI integration for generating summary

//setting up openai obj
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  if (!url || typeof url != "string")
    return res.status(400).json({ error: "Invalid URL" });

  if (!isYoutubeURL(url))
    return res
      .status(400)
      .json({ error: "Currently only YouTube URLs are supported." });

  //Extract video id
  // const videoId = extractVideoId(url);
  // if (!videoId) return res.status(400).json({ error: "Invalid Youtube URL!" });

  try {
    const loader = YoutubeLoader.createFromUrl(url, {
      language: "en",
      addVideoInfo: true,
    });
    const docs = await loader.load();
    if (
      !docs.length ||
      !docs[0].pageContent ||
      docs[0].pageContent.trim().length === 0
    ) {
      return res
        .status(404)
        .json({ error: "No transcript found for this video." });
    }
    const transcript = docs[0].pageContent;

    // Optionally, you can slice the transcript for a preview
    // res.json({
    //   summary: `Transcript fetched! First 100 chars: ${transcript.slice(0, 1000)}...`,
    //   or just summary: transcript
    // });

    const trimmedTranscript = transcript.slice(0, 10000); //get first 10k words

    //compose prompt for AI

    const prompt = `Summarize the following in **around 100 words** : 
    ---
    ${trimmedTranscript}`;

    //Call OpenAI API
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
      });

      const summary =
        completion.choices[0]?.message?.content?.trim() ||
        "No summary generated.";

      res.json({ summary });

    } catch (summarizrErr) {
      console.error("OpenAI error : ", summarizrErr);
      res.status(500).json({ error: "Failed to generate summary!" });
    }
  } 
  catch (err) {
    res
      .status(500)
      .json({ error: "Sorry! Failed to fetch transcript for this video." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
