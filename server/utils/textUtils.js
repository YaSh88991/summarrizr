function splitBySentence(text, maxChunkLength = 4000) {
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
  const chunks = [];
  let chunk = "";

  for (const sentence of sentences) {
    if ((chunk + sentence).length > maxChunkLength) {
      chunks.push(chunk);
      chunk = "";
    }
    chunk += sentence;
  }
  if (chunk) chunks.push(chunk);
  return chunks;
}

module.exports = { splitBySentence };
