# 数据库设置说明

本项目使用 **MySQL** 来持久化存储学习历史数据。以下是设置步骤：

## 前置要求

1. **安装 MySQL Server**
   - macOS: `brew install mysql`
   - Windows: 下载 MySQL Installer [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
   - Linux: `sudo apt-get install mysql-server` (Ubuntu/Debian)

2. **确保 MySQL 服务正在运行**
   - macOS: `brew services start mysql`
   - Windows: MySQL 通常自动启动
   - Linux: `sudo systemctl start mysql`

## 配置步骤

### 1. 创建 `.env` 文件

将项目根目录中的 `.env.example` 复制为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置你的 MySQL 数据库连接信息：

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的MySQL密码
DB_NAME=learn_english
```

**配置说明：**
- `DB_HOST`: MySQL 服务器地址（本地开发通常为 localhost）
- `DB_PORT`: MySQL 服务器端口（默认 3306）
- `DB_USER`: MySQL 用户名（默认 root）
- `DB_PASSWORD`: MySQL 密码（首次安装通常为空或 password）
- `DB_NAME`: 数据库名称（建议保持默认 learn_english）

### 2. 初始化数据库

运行以下命令来创建数据库和表结构：

```bash
npm run db:init
```

这个命令会：
- 创建 `learn_english` 数据库
- 创建以下表：
  - `users`: 用户表
  - `words`: 单词表（存储单词信息）
  - `study_history`: 学习历史表（记录学习过的单词）
  - `practice_records`: 练习记录表（用于追踪学习进度）

**预期输出：**
```
连接到 MySQL 服务器...
✓ 数据库连接成功

创建数据库 learn_english...
✓ 数据库 learn_english 已创建或已存在
✓ 所有表已成功创建

✓ 数据库初始化完成！

数据库连接信息:
  主机: localhost
  端口: 3306
  数据库: learn_english
  用户: root
```

### 3. 迁移现有数据（可选）

如果你之前使用的是文件系统存储的学习历史数据（`study-data/` 目录），可以运行以下命令将数据迁移到 MySQL：

```bash
npm run db:migrate
```

这个命令会：
- 读取所有现存的 JSON 学习历史文件
- 将数据导入 MySQL 数据库
- 保留原始的 JSON 文件（不会删除）

**预期输出：**
```
连接到数据库...
✓ 数据库连接成功

开始迁移数据...
数据源: /Users/yiche/code/2025/github/learn_english/study-data

  ✓ 已迁移 2025-11-20: 6 个单词
  ✓ 已迁移 2025-11-19: 5 个单词

✓ 迁移完成!
  - 处理文件数: 2
  - 迁移日期数: 2
  - 迁移单词数: 11
```

## 启动应用

所有配置完成后，就可以启动应用了：

```bash
npm run dev
```

## 数据库架构

### users 表
存储用户信息

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

### words 表
存储单词的详细信息

```sql
CREATE TABLE words (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  english VARCHAR(255) NOT NULL,
  chinese VARCHAR(255) NOT NULL,
  phonetics_us VARCHAR(255),        -- 美音音标
  phonetics_uk VARCHAR(255),        -- 英音音标
  part_of_speech VARCHAR(100),      -- 词性
  audio_url_us VARCHAR(500),        -- 美音音频URL
  audio_url_uk VARCHAR(500),        -- 英音音频URL
  image_url VARCHAR(500),           -- 单词图片URL
  mnemonic TEXT,                    -- 助记词
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_user_word (user_id, english)
)
```

### study_history 表
记录学习历史（用户什么时候学了什么单词）

```sql
CREATE TABLE study_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  word_id INT NOT NULL,
  study_date DATE NOT NULL,
  study_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (word_id) REFERENCES words(id),
  INDEX idx_user_date (user_id, study_date)
)
```

### practice_records 表
记录练习进度（用于追踪学生在各种练习中的表现）

```sql
CREATE TABLE practice_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  word_id INT NOT NULL,
  practice_type VARCHAR(100) NOT NULL,  -- 练习类型：listening, fill_in, sort_letters等
  is_correct BOOLEAN DEFAULT NULL,      -- 是否正确
  practice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (word_id) REFERENCES words(id),
  INDEX idx_user_word (user_id, word_id)
)
```

## API 端点变化

### 学习历史 API

#### 1. 保存学习数据
**POST** `/api/study-history/save`

```json
{
  "words": [
    {
      "id": "1",
      "english": "apple",
      "chinese": "苹果",
      "phonetics": { "us": "/ˈæp.əl/", "uk": "/ˈæp.əl/" },
      "partOfSpeech": "noun",
      "audioUrls": { "us": "url", "uk": "url" },
      "imageUrl": "url",
      "mnemonic": ""
    }
  ],
  "date": "2025-11-20",
  "userId": 1  // 可选，不提供则使用默认用户
}
```

**响应：**
```json
{
  "success": true,
  "message": "Saved 6 new words for 2025-11-20",
  "date": "2025-11-20",
  "wordCount": 6
}
```

#### 2. 获取所有学习日期
**GET** `/api/study-history/list?userId=1`

**响应：**
```json
{
  "success": true,
  "dates": [
    {
      "date": "2025-11-20",
      "displayDate": "2025年11月20日",
      "wordCount": 6,
      "path": "2025/11/20"
    }
  ]
}
```

#### 3. 获取特定日期的单词
**GET** `/api/study-history/2025/11/20?userId=1`

**响应：**
```json
{
  "success": true,
  "date": "2025-11-20",
  "words": [
    {
      "id": "1",
      "english": "apple",
      "chinese": "苹果",
      "phonetics": { "us": "/ˈæp.əl/", "uk": "/ˈæp.əl/" },
      "partOfSpeech": "noun",
      "audioUrls": { "us": "url", "uk": "url" },
      "imageUrl": "url",
      "mnemonic": ""
    }
  ],
  "wordCount": 6
}
```

## 故障排除

### 无法连接到数据库

**错误信息：** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**解决方案：**
1. 确保 MySQL 服务正在运行
2. 检查 `.env` 文件中的数据库配置是否正确
3. 验证 MySQL 用户名和密码

### 数据库不存在

**错误信息：** `Error: Unknown database 'learn_english'`

**解决方案：**
运行 `npm run db:init` 来创建数据库和表

### 表不存在

**错误信息：** `Error: Table 'learn_english.words' doesn't exist`

**解决方案：**
确认已运行 `npm run db:init` 并且没有错误

### 权限错误

**错误信息：** `Error: Access denied for user 'root'@'localhost'`

**解决方案：**
1. 验证 MySQL 密码是否正确
2. 使用 MySQL 命令行验证连接：`mysql -h localhost -u root -p`
3. 如需重置 MySQL 密码，参考 [MySQL 官方文档](https://dev.mysql.com/doc/)

## 常见问题

### Q: 我想使用不同的数据库用户？
**A:** 编辑 `.env` 文件中的 `DB_USER` 和 `DB_PASSWORD`，确保该用户有创建数据库和表的权限。

### Q: 我可以同时使用文件系统存储和数据库吗？
**A:** 可以。迁移脚本不会删除原始的 JSON 文件，两个存储方式可以共存。

### Q: 如何备份数据库？
**A:** 使用 MySQL 的 `mysqldump` 工具：
```bash
mysqldump -h localhost -u root -p learn_english > backup.sql
```

### Q: 如何恢复备份？
**A:** 使用以下命令恢复：
```bash
mysql -h localhost -u root -p learn_english < backup.sql
```

## 更多帮助

如有问题，请参考：
- [MySQL 官方文档](https://dev.mysql.com/doc/)
- [mysql2 npm 包文档](https://github.com/sidorares/node-mysql2)
