import express from 'express';
import axios from 'axios';

const router = express.Router();

// Get pronunciation audio from Youdao
// Using Web Speech API on client side for better reliability
router.get('/tts', async (req, res) => {
  const { text, lang = 'en_US' } = req.query;

  if (!text) {
    return res.status(400).json({ error: 'Text parameter is required' });
  }

  try {
    // Using Youdao TTS API
    const url = 'https://dict.youdao.com/dictvoice';
    const response = await axios.get(url, {
      params: {
        audio: text,
        type: 2
      },
      responseType: 'arraybuffer',
      timeout: 10000
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(response.data);
  } catch (error) {
    console.error(`Error getting TTS: ${error.message}`);
    res.status(500).json({ error: 'Failed to get pronunciation' });
  }
});

export default router;
