const express = require("express");
const cors = require("cors");
require("dotenv").config();

const {
  YoutubeLoader,
} = require("@langchain/community/document_loaders/web/youtube");
const { splitBySentence } = require("./utils/textUtils");
const { getSummaryFromOpenAI } = require("./utils/openai");
const { detectPlatform } = require("./utils/detectPlatform");
const officeParser = require("officeparser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

//Work around for officeparser as extension was not getting preserved, so it was giving err in parsing as unrecognized file type.
// Custom storage config
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Get original extension
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

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

  //Block generic or irrelevant queries
  const irrelevantPatterns = [
    /who\s+are\s+you/i,
    /tell me a joke/i,
    /what\s+is\s+your\s+name/i,
    /write.*poem/i,
    /write.*story/i,
    /draw.*picture/i,
    /what\s+can\s+you\s+do/i,
    /how\s+are\s+you/i,
    /hi\b|hello\b|hey\b/i,
    /motivate/i,
    /recommend/i,
    /suggest/i,
    /chat/i,
    /conversation/i,
    /explain.*ai/i,
    /who.*made.*you/i,
    /what.*is.*this/i,
    /what.*are.*you/i,
  ];

  if (irrelevantPatterns.some((pat) => pat.test(text))) {
    return res.status(400).json({
      error: "Please enter actual text to summarize, not a general query.",
    });
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

//main summarize api for pdf
app.post("/api/summarize/pdf", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  // Helper for cleanup
  const cleanupFile = (filepath) => {
    fs.unlink(filepath, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });
  };

  try {
    officeParser.parseOffice(req.file.path, async function (data, err) {
      // Clean up as soon as possible!
      cleanupFile(req.file.path);

      if (err) {
        console.error("Officeparser error:", err);
        return res.status(500).json({ error: "Failed to read PDF file." });
      }
      if (!data || typeof data !== "string" || data.trim().length === 0) {
        return res
          .status(400)
          .json({ error: "Could not extract text from PDF." });
      }

      const MAX_TOKENS = 9000;
      try {
        // If short, summarize directly
        if (data.length < MAX_TOKENS) {
          const prompt = `Summarize the following PDF in around 100 words:\n---\n${data}`;
          const summary = await getSummaryFromOpenAI(prompt);
          return res.json({ summary });
        }

        // Chunk and summarize if large
        const chunks = splitBySentence(data, MAX_TOKENS);
        const chunkSummaries = [];
        for (const chunk of chunks) {
          const chunkPrompt = `Summarize the following PDF chunk in around 100 words:\n---\n${chunk}`;
          try {
            const chunkSummary = await getSummaryFromOpenAI(chunkPrompt);
            chunkSummaries.push(chunkSummary);
          } catch {
            chunkSummaries.push("");
          }
        }
        // Final summary
        const finalPrompt = `Combine and summarize these summaries in around 100 words:\n---\n${chunkSummaries.join(
          "\n\n"
        )}`;
        const finalSummary = await getSummaryFromOpenAI(finalPrompt);

        return res.json({ summary: finalSummary });
      } catch (err) {
        console.error("Summary error:", err);
        return res
          .status(500)
          .json({ error: "Failed to summarize PDF content." });
      }
    });
  } catch (err) {
    cleanupFile(req.file.path);
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

//main summarize api for docs
app.post("/api/summarize/docs", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  // Helper for cleanup
  const cleanupFile = (filepath) => {
    fs.unlink(filepath, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });
  };

  try {
    officeParser.parseOffice(req.file.path, async function (data, err) {
      // Clean up as soon as possible!
      cleanupFile(req.file.path);

      if (err) {
        console.error("Officeparser error:", err);
        return res.status(500).json({ error: "Failed to read Docs file." });
      }
      if (!data || typeof data !== "string" || data.trim().length === 0) {
        return res
          .status(400)
          .json({ error: "Could not extract text from document!" });
      }

      const MAX_TOKENS = 9000;
      try {
        // If short, summarize directly
        if (data.length < MAX_TOKENS) {
          const prompt = `Summarize the following Docs in around 100 words:\n---\n${data}`;
          const summary = await getSummaryFromOpenAI(prompt);
          return res.json({ summary });
        }

        // Chunk and summarize if large
        const chunks = splitBySentence(data, MAX_TOKENS);
        const chunkSummaries = [];
        for (const chunk of chunks) {
          const chunkPrompt = `Summarize the following Docs chunk in around 100 words:\n---\n${chunk}`;
          try {
            const chunkSummary = await getSummaryFromOpenAI(chunkPrompt);
            chunkSummaries.push(chunkSummary);
          } catch {
            chunkSummaries.push("");
          }
        }
        // Final summary
        const finalPrompt = `Combine and summarize these summaries in around 100 words:\n---\n${chunkSummaries.join(
          "\n\n"
        )}`;
        const finalSummary = await getSummaryFromOpenAI(finalPrompt);

        return res.json({ summary: finalSummary });
      } catch (err) {
        console.error("Summary error:", err);
        return res
          .status(500)
          .json({ error: "Failed to summarize Docs content." });
      }
    });
  } catch (err) {
    cleanupFile(req.file.path);
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

//main summarize api for pptx
app.post("/api/summarize/pptx", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  // Helper for cleanup
  const cleanupFile = (filepath) => {
    fs.unlink(filepath, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });
  };

  try {
    officeParser.parseOffice(req.file.path, async function (data, err) {
      // Clean up as soon as possible!
      cleanupFile(req.file.path);

      if (err) {
        console.error("Officeparser error:", err);
        return res
          .status(500)
          .json({ error: "Failed to read presentation file." });
      }
      if (!data || typeof data !== "string" || data.trim().length === 0) {
        return res
          .status(400)
          .json({ error: "Could not extract text from ppt!" });
      }

      const MAX_TOKENS = 9000;
      try {
        // If short, summarize directly
        if (data.length < MAX_TOKENS) {
          const prompt = `Summarize the following PPT in around 100 words:\n---\n${data}`;
          const summary = await getSummaryFromOpenAI(prompt);
          return res.json({ summary });
        }

        // Chunk and summarize if large
        const chunks = splitBySentence(data, MAX_TOKENS);
        const chunkSummaries = [];
        for (const chunk of chunks) {
          const chunkPrompt = `Summarize the following PPT chunk in around 100 words:\n---\n${chunk}`;
          try {
            const chunkSummary = await getSummaryFromOpenAI(chunkPrompt);
            chunkSummaries.push(chunkSummary);
          } catch {
            chunkSummaries.push("");
          }
        }
        // Final summary
        const finalPrompt = `Combine and summarize these summaries in around 100 words:\n---\n${chunkSummaries.join(
          "\n\n"
        )}`;
        const finalSummary = await getSummaryFromOpenAI(finalPrompt);

        return res.json({ summary: finalSummary });
      } catch (err) {
        console.error("Summary error:", err);
        return res
          .status(500)
          .json({ error: "Failed to summarize ppt content." });
      }
    });
  } catch (err) {
    cleanupFile(req.file.path);
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

//main summarize api for excel
app.post("/api/summarize/excel", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  // Helper for cleanup
  const cleanupFile = (filepath) => {
    fs.unlink(filepath, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });
  };

  try {
    officeParser.parseOffice(req.file.path, async function (data, err) {
      // Clean up as soon as possible!
      cleanupFile(req.file.path);

      if (err) {
        console.error("Officeparser error:", err);
        return res.status(500).json({ error: "Failed to read Excel file." });
      }
      if (!data || typeof data !== "string" || data.trim().length === 0) {
        return res
          .status(400)
          .json({ error: "Could not extract text from Excel!" });
      }

      const MAX_TOKENS = 9000;
      try {
        // If short, summarize directly
        if (data.length < MAX_TOKENS) {
          const prompt = `Summarize the following Excel file in around 100 words:\n---\n${data}`;
          const summary = await getSummaryFromOpenAI(prompt);
          return res.json({ summary });
        }

        // Chunk and summarize if large
        const chunks = splitBySentence(data, MAX_TOKENS);
        const chunkSummaries = [];
        for (const chunk of chunks) {
          const chunkPrompt = `Summarize the following Excel chunk in around 100 words:\n---\n${chunk}`;
          try {
            const chunkSummary = await getSummaryFromOpenAI(chunkPrompt);
            chunkSummaries.push(chunkSummary);
          } catch {
            chunkSummaries.push("");
          }
        }
        // Final summary
        const finalPrompt = `Combine and summarize these summaries in around 100 words:\n---\n${chunkSummaries.join(
          "\n\n"
        )}`;
        const finalSummary = await getSummaryFromOpenAI(finalPrompt);

        return res.json({ summary: finalSummary });
      } catch (err) {
        console.error("Summary error:", err);
        return res
          .status(500)
          .json({ error: "Failed to summarize Excel content." });
      }
    });
  } catch (err) {
    cleanupFile(req.file.path);
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
