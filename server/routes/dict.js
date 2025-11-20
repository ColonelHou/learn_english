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
    // Helper function to validate IPA text (should contain / and phonetic characters)
    const isValidIPA = (text) => {
      if (!text || typeof text !== 'string') return false;
      // Valid IPA should start and end with / and contain phonetic symbols
      return /^\/[a-zːəɪæʊʌɔɛɒʃθðŋĝĵŵŷẑčğħĵķļņŕšţůûüźžß\s\.\-ˈˌ]+\/$/.test(text);
    };

    // Find all phonetics sections in order they appear
    const pronElements = $('span.pron.dpron');
    const extractedPhonetics = [];

    pronElements.each((index, element) => {
      const text = $(element).text().trim();
      if (isValidIPA(text)) {
        extractedPhonetics.push(text);
      }
    });

    // Assign UK and US based on their occurrence order or labels
    // Usually UK comes first, then US in Cambridge Dictionary
    if (extractedPhonetics.length >= 2) {
      result.phonetics.uk = extractedPhonetics[0];
      result.phonetics.us = extractedPhonetics[1];
    } else if (extractedPhonetics.length === 1) {
      // If only one found, assign to both
      result.phonetics.uk = extractedPhonetics[0];
      result.phonetics.us = extractedPhonetics[0];
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
