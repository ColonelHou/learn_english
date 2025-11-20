# 📚 English Learning System for Primary School Students

A comprehensive interactive English word learning system designed specifically for 4th-grade students. This system combines pronunciation, visual aids, and gamified practice exercises to make learning engaging and effective.

## Features

### 📖 Core Features

- **Word Import System**: Batch import words with English-Chinese translations
- **Pronunciation Support**: US and UK pronunciation from Cambridge Dictionary with audio playback
- **Visual Learning**: Associated images for each word to aid memorization
- **Memory Aids**: Add personal mnemonics to remember words better
- **Progress Tracking**: Score tracking across all practice sessions

### 🎮 Practice Modules

1. **🎧 Listening Practice**
   - Listen to word pronunciation
   - Select the correct word from 4 options
   - Instant feedback

2. **✏️ Fill in the Blanks**
   - Word with missing letters
   - Select letters to complete the word
   - Gentle error handling

3. **🔤 Sort Letters**
   - Arrange scrambled letters to form words
   - Shows only the Chinese meaning
   - No hints for wrong answers

4. **📝 Spelling Practice**
   - Listen to pronunciation
   - Type the word in input field
   - Real-time feedback

5. **🖼️ Image Fill-in**
   - View word image and Chinese meaning
   - Type the English word
   - Focus on word-image association

6. **🎤 Pronunciation Test**
   - Speak the word into the microphone
   - System checks pronunciation accuracy
   - Percentage score display

## System Requirements

- Node.js 16.x or higher
- Modern web browser with:
  - ES2020 support
  - Web Speech API (for pronunciation testing)
  - MediaStream API (for audio recording)

### Tested Browsers
- Chrome 90+
- Edge 90+
- Safari 14+
- Firefox 89+ (limited Web Speech API support)

## Installation

### 1. Clone and Setup

```bash
cd learn_english
npm install
cd client
npm install
cd ..
```

### 2. Configuration

Copy `.env.example` to `.env` and configure (optional):

```bash
cp .env.example .env
```

If you want to use Unsplash or Pixabay for high-quality images, add your API keys:
- Get Unsplash key: https://unsplash.com/developers
- Get Pixabay key: https://pixabay.com/api/docs/

Without API keys, the system will use placeholder images.

### 3. Start the Application

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend on `http://localhost:3000`

## Usage Guide

### Step 1: Import Words

1. Open the application at `http://localhost:3000`
2. Paste your word list in the import box
3. Format: `English Word [tab] Chinese Meaning` or `English Word, Chinese Meaning`

Example:
```
apple	苹果
cat	猫
dog	狗
book	书
```

### Step 2: Explore Word Details

1. From the Practice Menu, click on a word to view details
2. See pronunciation (US/UK with audio)
3. Add memory aids to help remember
4. View associated images

### Step 3: Practice Exercises

1. Choose a practice type from the menu
2. Complete exercises
3. Get immediate feedback
4. Track your score

## Project Structure

```
learn_english/
├── server/
│   ├── index.js                 # Express server
│   ├── routes/
│   │   ├── dict.js             # Dictionary API (Cambridge)
│   │   ├── pronunciation.js    # TTS API (Youdao)
│   │   └── image.js            # Image search API
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WordImport.tsx  # Word import interface
│   │   │   ├── WordDetail.tsx  # Word details view
│   │   │   ├── PracticeMenu.tsx# Practice selection
│   │   │   └── practices/      # Practice modules
│   │   ├── types.ts            # TypeScript types
│   │   ├── App.tsx             # Main app component
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
├── .env.example
├── .gitignore
└── package.json
```

## API Endpoints

### Dictionary Endpoint
```
GET /api/dict/:word
Response: {
  word: string
  phonetics: { us: string, uk: string }
  partOfSpeech: string
  audioUrls: { us: string | null, uk: string | null }
}
```

### Image Endpoint
```
GET /api/image/:word?chinese=meaning
Response: { imageUrl: string }
```

### TTS Endpoint
```
GET /api/pronunciation/tts?text=word&lang=en_US
Response: audio/mpeg (binary)
```

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Axios** - HTTP client
- **Cheerio** - HTML parsing for Cambridge Dictionary

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **CSS3** - Styling with CSS variables

### External APIs
- **Cambridge Dictionary** - Pronunciation and phonetics
- **Youdao** - Text-to-speech
- **Unsplash** - High-quality images (optional)
- **Pixabay** - Royalty-free images (optional)
- **Web Speech API** - Browser-based speech recognition

## Features Details

### Smart Error Handling
- Fill-in blanks: No hints on wrong letters, encourages re-learning
- Sort letters: Shows error but not the answer
- Spelling: Clear feedback with correct word shown
- Image fill: User can retry immediately

### Responsive Design
- Mobile-friendly interface
- Touch-optimized buttons
- Responsive grid layouts
- Works on tablets and desktop

### Student-Friendly UI
- Colorful and engaging design
- Clear visual feedback
- Emoji icons for easy navigation
- Motivational feedback messages
- Progress indicators

## Troubleshooting

### Common Issues

**Q: Images not loading**
- Check internet connection
- System will use placeholder images as fallback
- Consider adding API keys for better results

**Q: Audio not playing**
- Ensure browser allows audio playback
- Check speaker volume
- Some words may not have audio in Cambridge Dictionary

**Q: Speech Recognition not working**
- Use a Chromium-based browser (Chrome, Edge)
- Allow microphone permissions
- Ensure stable internet connection
- Firefox has limited support

**Q: Server connection error**
- Ensure backend is running on port 3001
- Check if ports are not blocked by firewall
- Verify CORS settings in server

## Development

### Building for Production

```bash
npm run build
npm start
```

### Running Tests

```bash
# Coming soon
```

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## Support

For issues and feature requests, please create an issue on the repository.

## Educational Benefits

This system helps students:
- ✅ Develop comprehensive English vocabulary
- ✅ Improve pronunciation accuracy
- ✅ Enhance listening comprehension
- ✅ Practice spelling in context
- ✅ Build word-image associations
- ✅ Increase retention through varied exercises
- ✅ Develop self-learning habits
- ✅ Track their own progress

## Future Enhancements

- [ ] User accounts and progress persistence
- [ ] Spaced repetition system
- [ ] Sentence usage examples
- [ ] Synonym and antonym learning
- [ ] Leaderboard and achievements
- [ ] Customizable difficulty levels
- [ ] Offline mode support
- [ ] Word category organization
- [ ] Grammar lessons integration

---

**Created with ❤️ for English learners**
