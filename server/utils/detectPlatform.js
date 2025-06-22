const { isYoutubeURL } = require("./youtube");

// (We can Add regex for other platforms later as we expand)
const VIDEO_PLATFORMS = [
  {
    key: "youtube",
    regex: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//,
  },
  { key: "vimeo", regex: /vimeo\.com/ },
  { key: "dailymotion", regex: /dailymotion\.com/ },
  // ...add more as needed
];

function detectPlatform(url) {
  if (isYoutubeURL(url)) return "youtube";
  //if (/vimeo\.com/.test(url)) return "vimeo";
  //if (/dailymotion\.com/.test(url)) return "dailymotion";
  // Check if this is any kind of video platform (expand as you add more)
  for (const { regex } of VIDEO_PLATFORMS) {
    if (regex.test(url)) {
      // Not implemented, but IS a video URL.
      return "coming-soon";
    }
  }
  // If we got here, it's just a random (non-video) URL.
  return "not-a-video";
}

module.exports = { detectPlatform };
