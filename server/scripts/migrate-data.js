import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HISTORY_BASE_DIR = path.join(__dirname, '../../study-data');
const DB_NAME = process.env.DB_NAME || 'learn_english';
const DEFAULT_USER_ID = 1;

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: DB_NAME
};

async function migrateData() {
  let connection;
  try {
    console.log('连接到数据库...');
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('✓ 数据库连接成功\n');

    console.log('开始迁移数据...');
    console.log(`数据源: ${HISTORY_BASE_DIR}\n`);

    let totalWords = 0;
    let totalDates = 0;
    let totalFiles = 0;

    // Check if study-data directory exists
    try {
      await fs.access(HISTORY_BASE_DIR);
    } catch {
      console.log('✓ 没有找到 study-data 目录，迁移完成');
      return;
    }

    // Recursively read all words.json files
    async function migrateYears(basePath, yearStr = '') {
      try {
        const entries = await fs.readdir(basePath, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(basePath, entry.name);

          if (entry.isDirectory()) {
            const year = parseInt(entry.name);

            if (!isNaN(year)) {
              // This is a year directory
              await migrateMonths(fullPath, year);
            } else {
              // Continue searching deeper
              await migrateYears(fullPath);
            }
          }
        }
      } catch (error) {
        console.error(`错误: 无法读取目录 ${basePath}:`, error.message);
      }
    }

    async function migrateMonths(basePath, year) {
      try {
        const months = await fs.readdir(basePath, { withFileTypes: true });

        for (const monthEntry of months) {
          const monthPath = path.join(basePath, monthEntry.name);

          if (monthEntry.isDirectory()) {
            const month = monthEntry.name;
            await migrateDays(monthPath, year, month);
          }
        }
      } catch (error) {
        console.error(`错误: 无法读取月份目录:`, error.message);
      }
    }

    async function migrateDays(basePath, year, month) {
      try {
        const days = await fs.readdir(basePath, { withFileTypes: true });

        for (const dayEntry of days) {
          const dayPath = path.join(basePath, dayEntry.name);

          if (dayEntry.isDirectory()) {
            const day = dayEntry.name;
            const wordsFile = path.join(dayPath, 'words.json');

            try {
              const content = await fs.readFile(wordsFile, 'utf-8');
              const data = JSON.parse(content);

              if (data.words && Array.isArray(data.words)) {
                const dateStr = `${year}-${month}-${day}`;
                await migrateWordsForDate(data.words, dateStr);

                totalFiles++;
                totalWords += data.words.length;
                totalDates++;

                console.log(
                  `  ✓ 已迁移 ${dateStr}: ${data.words.length} 个单词`
                );
              }
            } catch (error) {
              // Skip if words.json doesn't exist or is invalid
            }
          }
        }
      } catch (error) {
        console.error(`错误: 无法读取日期目录:`, error.message);
      }
    }

    async function migrateWordsForDate(words, dateStr) {
      await connection.beginTransaction();

      try {
        let savedCount = 0;

        for (const word of words) {
          // Check if word exists
          const [existing] = await connection.execute(
            `SELECT id FROM ${DB_NAME}.words WHERE user_id = ? AND english = ?`,
            [DEFAULT_USER_ID, word.english]
          );

          let wordId;

          if (existing.length === 0) {
            // Insert new word
            const [result] = await connection.execute(
              `INSERT INTO ${DB_NAME}.words
              (user_id, english, chinese, phonetics_us, phonetics_uk, part_of_speech, audio_url_us, audio_url_uk, image_url, mnemonic)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                DEFAULT_USER_ID,
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
          }

          // Check if study history already exists
          const [existingHistory] = await connection.execute(
            `SELECT id FROM ${DB_NAME}.study_history WHERE user_id = ? AND word_id = ? AND study_date = ?`,
            [DEFAULT_USER_ID, wordId, dateStr]
          );

          if (existingHistory.length === 0) {
            // Insert study history
            await connection.execute(
              `INSERT INTO ${DB_NAME}.study_history (user_id, word_id, study_date) VALUES (?, ?, ?)`,
              [DEFAULT_USER_ID, wordId, dateStr]
            );
            savedCount++;
          }
        }

        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      }
    }

    // Start migration
    await migrateYears(HISTORY_BASE_DIR);

    console.log('\n✓ 迁移完成!');
    console.log(`  - 处理文件数: ${totalFiles}`);
    console.log(`  - 迁移日期数: ${totalDates}`);
    console.log(`  - 迁移单词数: ${totalWords}`);
  } catch (error) {
    console.error('\n✗ 迁移失败:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

migrateData();
