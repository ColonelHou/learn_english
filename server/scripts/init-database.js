import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password'
};

const DB_NAME = process.env.DB_NAME || 'learn_english';

// SQL表定义
const CREATE_DATABASE_SQL = `CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`;

const CREATE_TABLES_SQL = [
  // 用户表
  `CREATE TABLE IF NOT EXISTS ${DB_NAME}.users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // 单词表
  `CREATE TABLE IF NOT EXISTS ${DB_NAME}.words (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    english VARCHAR(255) NOT NULL,
    chinese VARCHAR(255) NOT NULL,
    phonetics_us VARCHAR(255),
    phonetics_uk VARCHAR(255),
    part_of_speech VARCHAR(100),
    audio_url_us VARCHAR(500),
    audio_url_uk VARCHAR(500),
    image_url VARCHAR(500),
    mnemonic TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_word (user_id, english)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // 学习记录表
  `CREATE TABLE IF NOT EXISTS ${DB_NAME}.study_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    word_id INT NOT NULL,
    study_date DATE NOT NULL,
    study_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, study_date),
    INDEX idx_study_date (study_date)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // 练习记录表（用于追踪学习进度）
  `CREATE TABLE IF NOT EXISTS ${DB_NAME}.practice_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    word_id INT NOT NULL,
    practice_type VARCHAR(100) NOT NULL,
    is_correct BOOLEAN DEFAULT NULL,
    practice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
    INDEX idx_user_word (user_id, word_id),
    INDEX idx_practice_date (practice_date)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
];

// 初始化数据库
async function initializeDatabase() {
  let connection;
  try {
    console.log('连接到 MySQL 服务器...');
    connection = await mysql.createConnection(DB_CONFIG);

    // 创建数据库
    console.log(`创建数据库 ${DB_NAME}...`);
    await connection.execute(CREATE_DATABASE_SQL);
    console.log(`✓ 数据库 ${DB_NAME} 已创建或已存在`);

    // 创建表
    console.log('创建表结构...');
    for (const sql of CREATE_TABLES_SQL) {
      await connection.execute(sql);
    }
    console.log('✓ 所有表已成功创建');

    // 检查是否存在默认用户
    const [users] = await connection.execute(
      `SELECT * FROM ${DB_NAME}.users WHERE username = 'default'`
    );

    if (users.length === 0) {
      console.log('创建默认用户...');
      await connection.execute(
        `INSERT INTO ${DB_NAME}.users (username, email) VALUES (?, ?)`,
        ['default', 'user@example.com']
      );
      console.log('✓ 默认用户已创建');
    }

    console.log('\n✓ 数据库初始化完成！');
    console.log('\n数据库连接信息:');
    console.log(`  主机: ${DB_CONFIG.host}`);
    console.log(`  端口: ${DB_CONFIG.port}`);
    console.log(`  数据库: ${DB_NAME}`);
    console.log(`  用户: ${DB_CONFIG.user}`);

  } catch (error) {
    console.error('✗ 数据库初始化失败:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initializeDatabase();
