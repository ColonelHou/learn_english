import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const router = express.Router();

// Cache for dictionary entries
const dictCache = new Map();

// Scrape word information from Cambridge Dictionary
async function fetchFromCambridge(word) {
  try {
    const url = `https://dictionary.cambridge.org/dictionary/english/${word.toLowerCase()}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);

    const result = {
      word,
      phonetics: {
        us: null,
        uk: null
      },
      partOfSpeech: null,
      definitions: []
    };

    // Extract phonetics - IPA symbols from span.pron.dpron
    // Find UK phonetic (first occurrence of uk + next pron)
    const ukSection = $('.uk.dpron-i').first();
    if (ukSection.length > 0) {
      const ukPronElement = ukSection.parent().find('span.pron.dpron').first();
      if (ukPronElement.length > 0) {
        const ukText = ukPronElement.text().trim();
        if (ukText) result.phonetics.uk = ukText;
      }
    }

    // Find US phonetic (second occurrence or labeled us)
    const usSection = $('.us.dpron-i').first();
    if (usSection.length > 0) {
      const usPronElement = usSection.parent().find('span.pron.dpron').first();
      if (usPronElement.length > 0) {
        const usText = usPronElement.text().trim();
        if (usText) result.phonetics.us = usText;
      }
    }

    // Fallback: if the above doesn't work, try getting all pron spans
    if (!result.phonetics.us && !result.phonetics.uk) {
      const allProns = $('span.pron.dpron').text().trim();
      // Usually the phonetics appear in sequence, try to split them
      const ipaMatches = response.data.match(/\/[^\/]+\//g);
      if (ipaMatches && ipaMatches.length >= 2) {
        result.phonetics.uk = ipaMatches[0].trim();
        result.phonetics.us = ipaMatches[1].trim();
      }
    }

    // Extract part of speech
    const pos = $('.pos.dpos').first().text();
    if (pos) result.partOfSpeech = pos.trim();

    // Extract pronunciation URLs
    const usAudio = $('source[src*="us_pron"]').attr('src');
    const ukAudio = $('source[src*="uk_pron"]').attr('src');

    result.audioUrls = {
      us: usAudio ? `https://dictionary.cambridge.org${usAudio}` : null,
      uk: ukAudio ? `https://dictionary.cambridge.org${ukAudio}` : null
    };

    return result;
  } catch (error) {
    console.error(`Error fetching from Cambridge: ${error.message}`);
    return null;
  }
}

// Get word information
router.get('/:word', async (req, res) => {
  const word = req.params.word.toLowerCase();

  // Check cache
  if (dictCache.has(word)) {
    return res.json(dictCache.get(word));
  }

  const data = await fetchFromCambridge(word);

  if (data) {
    dictCache.set(word, data);
    res.json(data);
  } else {
    res.status(404).json({ error: 'Word not found' });
  }
});

export default router;
