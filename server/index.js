const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.get('/test/ping' , (req, res) =>{
  res.json({message : 'pong'})
})

app.post('/api/summarize', async (req, res) => {
   const { url } = req.body;
  // For now, just return a dummy summary
  // Later, you'll add actual video processing here
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // TODO: Add video processing & summarization here
  // For demo, just echo back
  res.json({ summary: `Summary for: ${url}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
