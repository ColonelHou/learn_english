# 🚀 Quick Start Guide

Get your English Learning System up and running in 5 minutes!

## Prerequisites

- Node.js 16+ installed
- Git (optional)
- A modern web browser

## Installation Steps

### 1. Install Dependencies

```bash
cd /path/to/learn_english
npm install
cd client
npm install
cd ..
```

Takes about 2-3 minutes depending on internet speed.

### 2. Start the Application

```bash
npm run dev
```

You'll see output like:
```
Server is running on port 3001
VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

### 3. Open in Browser

Visit: **http://localhost:3000**

## First Run - Sample Words

Use these sample words to test the system:

```
apple	苹果
banana	香蕉
cat	猫
dog	狗
book	书
house	房子
tree	树
flower	花
sun	太阳
moon	月亮
```

**How to use:**
1. Copy the above text
2. Paste into the word import box
3. Click "Import Words"
4. System will fetch pronunciation and images automatically

## What Happens During Import

When you import words, the system:

1. ✅ Fetches pronunciation from Cambridge Dictionary
2. ✅ Gets phonetics (US and UK)
3. ✅ Downloads related images
4. ✅ Stores everything locally in your browser

This may take 10-30 seconds for 10 words (depends on internet).

## Available Exercises

### 1. Listening Practice 🎧
- **How it works:** Click "Play Sound" button, hear the word, select correct option
- **Difficulty:** Easy
- **Best for:** Improving listening comprehension

### 2. Fill in the Blanks ✏️
- **How it works:** Word has blanks, you click letters to fill them
- **Difficulty:** Medium
- **Best for:** Learning word spelling

### 3. Sort Letters 🔤
- **How it works:** Arrange scrambled letters to form words
- **Difficulty:** Medium
- **Best for:** Letter recognition and spelling

### 4. Spelling Practice 📝
- **How it works:** Listen to word, type it in the box
- **Difficulty:** Hard
- **Best for:** Spelling accuracy

### 5. Image Fill-in 🖼️
- **How it works:** See image and meaning, type the word
- **Difficulty:** Easy-Medium
- **Best for:** Visual word association

### 6. Pronunciation Test 🎤
- **How it works:** Say the word, system checks accuracy
- **Difficulty:** Medium
- **Best for:** Accent improvement (Chrome/Edge only)

## Troubleshooting

### Issue: "Cannot connect to server"
**Solution:**
- Wait 5 seconds and refresh the page
- Check if backend is running (you should see "Server is running on port 3001" in terminal)
- Try stopping (Ctrl+C) and restarting: `npm run dev`

### Issue: "Audio not playing"
**Solution:**
- Check browser volume
- Try a different browser (Chrome recommended)
- Some words may not have audio in the dictionary
- Check internet connection

### Issue: "Pronunciation Test not working"
**Solution:**
- Use Chrome, Edge, or Brave browser
- Firefox has limited support
- Safari may not have full Web Speech API support
- Grant microphone permission when prompted

### Issue: "Images show placeholder instead of actual image"
**Solution:**
- This is normal if you don't have API keys
- Add Unsplash or Pixabay API keys in `.env` file
- System will still work with placeholder images

## Tips for Best Results

### For Teachers
1. Start with 10-15 words per session
2. Mix easy and hard words
3. Use consistently (5-10 minutes daily is better than 1 hour weekly)
4. Have students focus on one exercise type at a time

### For Students
1. Practice listening first, then spelling
2. Use word details to add personal memory tips
3. Try to get 80%+ accuracy before moving to harder exercises
4. Pronounce words out loud, don't just listen

### For Parents
1. Encourage 5-10 minute daily sessions
2. Listen to student's pronunciation together
3. Celebrate improvements and progress
4. Don't force - make it fun!

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Submit Spelling Answer | Enter |
| Submit Image Fill Answer | Enter |
| Next Exercise | Right Arrow or Click Next |

## Data Storage

- All data is stored **locally in your browser**
- No data is sent to external servers (except for images/audio)
- Clearing browser cache will reset progress
- Each browser/device has separate progress

## Network Requirements

**Minimum:**
- 1 Mbps for normal operation
- 5 Mbps recommended for smooth experience

**What gets downloaded:**
- Word audio files (~50-100 KB per word)
- Word images (~100-500 KB per word)
- Dictionary data (small, cached)

**Total per session:** ~10-50 MB for 20-30 words

## System Performance

| Action | Time |
|--------|------|
| Import 10 words | 10-30 seconds |
| Load exercise | 1-2 seconds |
| Play audio | Instant |
| Check answer | Instant |
| Get image | 2-5 seconds |

## Getting Help

1. **Check README.md** for detailed documentation
2. **Browser Console** (F12) - check for error messages
3. **Restart** - sometimes a fresh start helps
4. **Check internet** - many features require internet

## Next Steps

1. ✅ Run the system
2. ✅ Import sample words
3. ✅ Try each exercise type
4. ✅ Create your own word list
5. ✅ Share with students/friends

## Customization

Once you're comfortable, try:

1. **Change colors** - Edit `client/src/index.css` variables
2. **Add more words** - Copy-paste in import box
3. **Adjust exercises** - Edit practice components in `client/src/components/practices/`

## System Requirements Check

```bash
# Check Node.js version
node --version  # Should be 16.0.0 or higher

# Check npm version
npm --version   # Should be 7.0.0 or higher
```

---

**Enjoy learning! 📚✨**

For full documentation, see [README.md](./README.md)
