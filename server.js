const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

async function fetchWebContent(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        let textContent = '';

        $('p').each((i, elem) => {
            textContent += $(elem).text() + '\n';
        });

        return textContent;
    } catch (error) {
        console.error('Error fetching web content:', error);
        return '';
    }
}

app.post('/fetch-web-content', async (req, res) => {
    const { url } = req.body;
    const content = await fetchWebContent(url);
    res.json({ content });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
