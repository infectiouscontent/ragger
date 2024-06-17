import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/api/fetch-web-content', async (req, res) => {
  try {
    const url = 'https://www.mitzvah.capital/';
    const response = await fetch(url);
    const text = await response.text();
    res.status(200).json({ content: text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});