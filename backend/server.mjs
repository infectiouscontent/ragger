import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express(); // Create an instance of Express
const PORT = 3000; // Define the port the server will listen on

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(express.json()); // Parse incoming JSON requests

// Root route
app.get('/', (req, res) => {
  res.send('Server is running'); // Respond with a simple message
});

// Route to fetch web content
app.get('/api/fetch-web-content', async (req, res) => {
  try {
    const url = 'https://www.mitzvah.capital/'; // URL to fetch content from
    const response = await fetch(url); // Perform the fetch request
    const text = await response.text(); // Get the response text
    res.status(200).json({ content: text }); // Send the response text as JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors and send a 500 response
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Log the server URL
});