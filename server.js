const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Replace with your actual API key from Google Cloud Console
const API_KEY = 'AIzaSyD4tfT742jsUCItKboQPhbvYoPlJBlivOI'; // Get from https://console.cloud.google.com/apis/credentials
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

app.post('/chat', async (req, res) => {
    const userInput = req.body.message;

    if (!userInput) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        console.log('Sending request to Gemini API with input:', userInput);
        const response = await axios.post(
            `${API_URL}?key=${API_KEY}`,
            {
                contents: [{
                    parts: [{ text: userInput }]
                }]
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        console.log('Gemini API response:', JSON.stringify(response.data, null, 2));
        const botResponse = response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content && response.data.candidates[0].content.parts && response.data.candidates[0].content.parts[0]
            ? response.data.candidates[0].content.parts[0].text
            : 'No valid response from API';
        res.json({ response: botResponse });
    } catch (error) {
        console.error('Error calling Gemini API:', {
            message: error.message,
            response: error.response ? error.response.data : null,
            status: error.response ? error.response.status : null
        });
        res.status(500).json({ error: 'Failed to get response from Gemini API' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});