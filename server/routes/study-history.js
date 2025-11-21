import express from 'express';
import { getConnection, query } from '../config/database.js';

const router = express.Router();

const DB_NAME = process.env.DB_NAME || 'learn_english';
const DEFAULT_USER_ID = 1; // Default user for now

// Helper function to convert date to YYYY-MM-DD format
function formatDateString(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to get year, month, day from date string
function getYearMonthDay(dateString) {
  const [year, month, day] = dateString.split('-');
  return { year, month, day };
}

// Save words for a specific date to database
router.post('/save', async (req, res) => {
  const connection = await getConnection();
  try {
    const { words, date, userId } = req.body;
    const user_id = userId || DEFAULT_USER_ID;

    if (!words || !Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ error: 'Words array is required' });
    }

    // Parse date or use today
    const studyDate = date ? new Date(date) : new Date();
    const studyDateStr = formatDateString(studyDate);

    await connection.beginTransaction();

    try {
      let savedCount = 0;

      // Insert or update words in database
      for (const word of words) {
        // Insert word if not exists
        const [existing] = await connection.execute(
          `SELECT id FROM ${DB_NAME}.words WHERE user_id = ? AND english = ?`,
          [user_id, word.english]
        );

        let wordId;
        if (existing.length === 0) {
          const [result] = await connection.execute(
            `INSERT INTO ${DB_NAME}.words
            (user_id, english, chinese, phonetics_us, phonetics_uk, part_of_speech, audio_url_us, audio_url_uk, image_url, mnemonic)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              user_id,
              word.english,
              word.chinese,
              word.phonetics?.us || null,
              word.phonetics?.uk || null,
              word.partOfSpeech || null,
              word.audioUrls?.us || null,
              word.audioUrls?.uk || null,
              word.imageUrl || null,
              word.mnemonic || null
            ]
          );
          wordId = result.insertId;
        } else {
          wordId = existing[0].id;
          // Update existing word
          await connection.execute(
            `UPDATE ${DB_NAME}.words
            SET chinese = ?, phonetics_us = ?, phonetics_uk = ?, part_of_speech = ?,
                audio_url_us = ?, audio_url_uk = ?, image_url = ?, mnemonic = ?
            WHERE id = ?`,
            [
              word.chinese,
              word.phonetics?.us || null,
              word.phonetics?.uk || null,
              word.partOfSpeech || null,
              word.audioUrls?.us || null,
              word.audioUrls?.uk || null,
              word.imageUrl || null,
              word.mnemonic || null,
              wordId
            ]
          );
        }

        // Record study history
        const [existingHistory] = await connection.execute(
          `SELECT id FROM ${DB_NAME}.study_history WHERE user_id = ? AND word_id = ? AND study_date = ?`,
          [user_id, wordId, studyDateStr]
        );

        if (existingHistory.length === 0) {
          await connection.execute(
            `INSERT INTO ${DB_NAME}.study_history (user_id, word_id, study_date) VALUES (?, ?, ?)`,
            [user_id, wordId, studyDateStr]
          );
          savedCount++;
        }
      }

      await connection.commit();

      res.json({
        success: true,
        message: `Saved ${savedCount} new words for ${studyDateStr}`,
        date: studyDateStr,
        wordCount: savedCount
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error saving study history:', error);
    res.status(500).json({ error: 'Failed to save study history' });
  } finally {
    connection.release();
  }
});

// Get list of all study dates with word counts
router.get('/list', async (req, res) => {
  const connection = await getConnection();
  try {
    const user_id = req.query.userId || DEFAULT_USER_ID;

    const [dates] = await connection.execute(
      `SELECT DISTINCT study_date FROM ${DB_NAME}.study_history
       WHERE user_id = ?
       ORDER BY study_date DESC`,
      [user_id]
    );

    const historyDates = dates.map((row) => {
      // Convert Date object to YYYY-MM-DD string format
      const dateObj = new Date(row.study_date);
      const dateStr = dateObj.toISOString().split('T')[0];
      const { year, month, day } = getYearMonthDay(dateStr);
      const displayDate = `${year}年${month}月${day}日`;

      return {
        date: dateStr,
        displayDate,
        path: `${year}/${month}/${day}`
      };
    });

    // Add word counts for each date
    const result = [];
    for (const dateInfo of historyDates) {
      const [counts] = await connection.execute(
        `SELECT COUNT(*) as wordCount FROM ${DB_NAME}.study_history
         WHERE user_id = ? AND study_date = ?`,
        [user_id, dateInfo.date]
      );
      result.push({
        ...dateInfo,
        wordCount: counts[0].wordCount
      });
    }

    res.json({ success: true, dates: result });
  } catch (error) {
    console.error('Error listing study history:', error);
    res.status(500).json({ error: 'Failed to list study history' });
  } finally {
    connection.release();
  }
});

// Get words for a specific date
router.get('/:year/:month/:day', async (req, res) => {
  const connection = await getConnection();
  try {
    const { year, month, day } = req.params;
    const user_id = req.query.userId || DEFAULT_USER_ID;
    const dateStr = `${year}-${month}-${day}`;

    const [words] = await connection.execute(
      `SELECT
        w.id,
        w.english,
        w.chinese,
        w.phonetics_us,
        w.phonetics_uk,
        w.part_of_speech,
        w.audio_url_us,
        w.audio_url_uk,
        w.image_url,
        w.mnemonic
       FROM ${DB_NAME}.words w
       INNER JOIN ${DB_NAME}.study_history sh ON w.id = sh.word_id
       WHERE sh.user_id = ? AND sh.study_date = ?
       ORDER BY sh.study_time DESC`,
      [user_id, dateStr]
    );

    // Convert database format back to application format
    const formattedWords = words.map((word) => ({
      id: word.id.toString(),
      english: word.english,
      chinese: word.chinese,
      phonetics: {
        us: word.phonetics_us || '',
        uk: word.phonetics_uk || ''
      },
      partOfSpeech: word.part_of_speech || '',
      audioUrls: {
        us: word.audio_url_us || null,
        uk: word.audio_url_uk || null
      },
      imageUrl: word.image_url || '',
      mnemonic: word.mnemonic || ''
    }));

    res.json({
      success: true,
      date: dateStr,
      words: formattedWords,
      wordCount: formattedWords.length
    });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_TABLE') {
      return res.status(404).json({ error: 'No study data found for this date' });
    }
    console.error('Error reading study history:', error);
    res.status(500).json({ error: 'Failed to read study history' });
  } finally {
    connection.release();
  }
});

export default router;
