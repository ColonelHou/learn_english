import express from 'express';
import axios from 'axios';

const router = express.Router();

// Cache for images
const imageCache = new Map();

// Get image from Unsplash or Pixabay
async function fetchImageUrl(word, chineseMeaning) {
  const cacheKey = word.toLowerCase();

  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  try {
    // Try Unsplash API first (requires API key)
    // Fallback to a simple search-based approach
    const searchQuery = encodeURIComponent(chineseMeaning || word);

    // Using Unsplash as primary source (free tier available)
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=1&client_id=${process.env.UNSPLASH_API_KEY || 'demo'}`;

    try {
      const response = await axios.get(unsplashUrl, { timeout: 5000 });
      if (response.data.results && response.data.results.length > 0) {
        const imageUrl = response.data.results[0].urls.regular;
        imageCache.set(cacheKey, imageUrl);
        return imageUrl;
      }
    } catch (error) {
      console.warn(`Unsplash API error: ${error.message}`);
    }

    // Fallback to Pixabay
    const pixabayUrl = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY || 'demo'}&q=${searchQuery}&image_type=photo&per_page=1`;

    try {
      const response = await axios.get(pixabayUrl, { timeout: 5000 });
      if (response.data.hits && response.data.hits.length > 0) {
        const imageUrl = response.data.hits[0].webformatURL;
        imageCache.set(cacheKey, imageUrl);
        return imageUrl;
      }
    } catch (error) {
      console.warn(`Pixabay API error: ${error.message}`);
    }

    // Fallback: generate a placeholder URL using a simple service
    const placeholderUrl = `https://via.placeholder.com/400x300?text=${encodeURIComponent(chineseMeaning || word)}`;
    imageCache.set(cacheKey, placeholderUrl);
    return placeholderUrl;
  } catch (error) {
    console.error(`Error fetching image: ${error.message}`);
    return null;
  }
}

// Get image for a word
router.get('/:word', async (req, res) => {
  const { word } = req.params;
  const { chinese } = req.query;

  const imageUrl = await fetchImageUrl(word, chinese);

  if (imageUrl) {
    res.json({ imageUrl });
  } else {
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

export default router;
