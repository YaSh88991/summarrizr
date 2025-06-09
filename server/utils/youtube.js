function isYoutubeURL(url) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
}

function extractVideoId(url) {
  // Support various formats
  const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

module.exports = { isYoutubeURL, extractVideoId };