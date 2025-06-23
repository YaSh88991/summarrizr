const express = require("express");
const cors = require("cors");
require("dotenv").config();

const {
  YoutubeLoader,
} = require("@langchain/community/document_loaders/web/youtube");
const { splitBySentence } = require("./utils/textUtils");
const { getSummaryFromOpenAI } = require("./utils/openai");
const { detectPlatform } = require("./utils/detectPlatform");

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

//main summarize api for videos
app.post("/api/summarize/video", async (req, res) => {
  const { url } = req.body;

  // 1. Validate URL
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Invalid URL" });
  }

  // 2. Validate URL structure

  function isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  if (!isValidURL(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  // 3. Detect platform
  const platform = detectPlatform(url);

  switch (platform) {
    case "youtube":
      // Existing YouTube summarization logic here:
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
        const MAX_TOKENS = 9000;

        if (transcript.length < MAX_TOKENS) {
          const prompt = `Summarize the following in around 100 words:\n---\n${transcript}`;
          const summary = await getSummaryFromOpenAI(prompt);
          return res.json({ summary });
        } else {
          // LONG video logic
          const chunks = splitBySentence(transcript, MAX_TOKENS);
          const chunkSummaries = [];
          for (const chunk of chunks) {
            const chunkPrompt = `Summarize the following in around 100 words:\n---\n${chunk}`;
            try {
              const chunkSummary = await getSummaryFromOpenAI(chunkPrompt);
              chunkSummaries.push(chunkSummary);
            } catch (err) {
              chunkSummaries.push("");
            }
          }
          const finalPrompt = `Combine and summarize the following summaries in around 100 words, preserving the main ideas:\n---\n${chunkSummaries.join(
            "\n\n"
          )}`;
          const finalSummary = await getSummaryFromOpenAI(finalPrompt);
          return res.json({ summary: finalSummary });
        }
      } catch (err) {
        console.error("Transcript loader error: ", err);
        return res
          .status(500)
          .json({ error: "Sorry! Failed to fetch transcript for this video." });
      }

    // We can add cases for other video types later...

    case "coming-soon":
      return res.status(501).json({
        error:
          "This video platform is coming soon! Only YouTube is supported for now.",
      });

    case "not-a-video":
      return res.status(400).json({
        error: "Please enter a video URL.",
      });

    default:
      return res.status(501).json({
        error:
          "This video platform is coming soon! Only YouTube is supported for now.",
      });
  }
});

//main summarize api for texts
app.post("/api/summarize/text", async (req, res) => {
  const { text } = req.body;
  const MAX_TOKENS = 9000; // ~10k chars (adjust as needed)

  // 1. Validate input
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res
      .status(400)
      .json({ error: "Please enter some text to summarize." });
  }

  try {
    // 2. If short text, summarize directly
    if (text.length < MAX_TOKENS) {
      const prompt = `Summarize the following text in around 100 words:\n---\n${text}`;
      const summary = await getSummaryFromOpenAI(prompt);
      return res.json({ summary });
    }

    // 3. If long text, summarize in chunks then combine
    const chunks = splitBySentence(text, MAX_TOKENS);
    const chunkSummaries = [];
    for (const chunk of chunks) {
      const chunkPrompt = `Summarize the following text in around 100 words:\n---\n${chunk}`;
      try {
        const chunkSummary = await getSummaryFromOpenAI(chunkPrompt);
        chunkSummaries.push(chunkSummary);
      } catch (err) {
        chunkSummaries.push(""); // fallback so we don't break
      }
    }

    // 4. Final summary of summaries
    const finalPrompt = `Combine and summarize the following summaries in around 100 words, preserving the main ideas:\n---\n${chunkSummaries.join(
      "\n\n"
    )}`;
    const finalSummary = await getSummaryFromOpenAI(finalPrompt);

    return res.json({ summary: finalSummary });
  } catch (err) {
    console.error("OpenAI/text summary error:", err);
    return res
      .status(500)
      .json({ error: "Failed to generate summary. Please try again!" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
