import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Get the directory where this file is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base directory for study history
const HISTORY_BASE_DIR = path.join(__dirname, '../../study-data');

// Helper function to ensure directory exists
async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
  }
}

// Helper function to get date path (YYYY/MM/DD)
function getDatePath(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return { year, month, day };
}

// Helper function to get full path for a specific date
function getFullDatePath(year, month, day) {
  return path.join(HISTORY_BASE_DIR, year.toString(), month, day);
}

// Save words for a specific date
router.post('/save', async (req, res) => {
  try {
    const { words, date } = req.body;

    if (!words || !Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ error: 'Words array is required' });
    }

    // Parse date or use today
    const studyDate = date ? new Date(date) : new Date();
    const { year, month, day } = getDatePath(studyDate);
    const dirPath = getFullDatePath(year, month, day);

    // Ensure directory exists
    await ensureDir(dirPath);

    // Save words to JSON file
    const filePath = path.join(dirPath, 'words.json');
    const dataToSave = {
      date: studyDate.toISOString().split('T')[0],
      savedAt: new Date().toISOString(),
      wordCount: words.length,
      words: words,
    };

    await fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2));

    res.json({
      success: true,
      message: `Saved ${words.length} words for ${year}-${month}-${day}`,
      path: `${year}/${month}/${day}`,
    });
  } catch (error) {
    console.error('Error saving study history:', error);
    res.status(500).json({ error: 'Failed to save study history' });
  }
});

// Get list of all study dates with word counts
router.get('/list', async (req, res) => {
  try {
    const historyDates = [];

    // Check if base directory exists
    try {
      await fs.access(HISTORY_BASE_DIR);
    } catch {
      // Directory doesn't exist yet
      return res.json({ success: true, dates: [] });
    }

    // Recursively read all dates
    async function readYears(basePath) {
      const entries = await fs.readdir(basePath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(basePath, entry.name);

        if (entry.isDirectory()) {
          const year = parseInt(entry.name);

          if (isNaN(year)) continue;

          const months = await fs.readdir(fullPath, { withFileTypes: true });

          for (const monthEntry of months) {
            const monthPath = path.join(fullPath, monthEntry.name);

            if (monthEntry.isDirectory()) {
              const month = monthEntry.name;
              const days = await fs.readdir(monthPath, {
                withFileTypes: true,
              });

              for (const dayEntry of days) {
                const dayPath = path.join(monthPath, dayEntry.name);

                if (dayEntry.isDirectory()) {
                  const day = dayEntry.name;

                  // Check if words.json exists in this directory
                  const wordsFile = path.join(dayPath, 'words.json');
                  try {
                    const content = await fs.readFile(wordsFile, 'utf-8');
                    const data = JSON.parse(content);
                    historyDates.push({
                      date: `${year}-${month}-${day}`,
                      displayDate: `${year}年${month}月${day}日`,
                      wordCount: data.wordCount || data.words.length || 0,
                      path: `${year}/${month}/${day}`,
                    });
                  } catch {
                    // Skip if words.json doesn't exist or is invalid
                  }
                }
              }
            }
          }
        }
      }
    }

    await readYears(HISTORY_BASE_DIR);

    // Sort by date descending (newest first)
    historyDates.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ success: true, dates: historyDates });
  } catch (error) {
    console.error('Error listing study history:', error);
    res.status(500).json({ error: 'Failed to list study history' });
  }
});

// Get words for a specific date
router.get('/:year/:month/:day', async (req, res) => {
  try {
    const { year, month, day } = req.params;
    const dirPath = getFullDatePath(year, month, day);
    const filePath = path.join(dirPath, 'words.json');

    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);

    res.json({
      success: true,
      date: `${year}-${month}-${day}`,
      words: data.words,
      wordCount: data.wordCount || data.words.length,
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res
        .status(404)
        .json({ error: 'No study data found for this date' });
    }
    console.error('Error reading study history:', error);
    res.status(500).json({ error: 'Failed to read study history' });
  }
});

export default router;
