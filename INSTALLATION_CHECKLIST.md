# ✅ Installation & Setup Checklist

Use this checklist to ensure everything is set up correctly.

## Pre-Installation

- [ ] You have Node.js 16.0.0 or higher installed
- [ ] You have npm 7.0.0 or higher installed
- [ ] You have at least 500 MB free disk space
- [ ] Your internet connection is stable
- [ ] You can access Cambridge Dictionary website

## Installation Steps

### Step 1: Navigate to Project
```bash
cd /Users/yiche/code/2025/my/learn_english
```
- [ ] Successfully navigated to learn_english directory

### Step 2: Install Root Dependencies
```bash
npm install
```
- [ ] Installation completed without major errors
- [ ] node_modules folder created
- [ ] package-lock.json created

### Step 3: Install Client Dependencies
```bash
cd client
npm install
cd ..
```
- [ ] Client node_modules folder created
- [ ] Client package-lock.json created
- [ ] Back in root directory

### Step 4: Create Environment File
```bash
cp .env.example .env
```
- [ ] .env file created
- [ ] .env has PORT=3001 set

### Step 5: Verify All Files Exist

**Root Files:**
- [ ] package.json
- [ ] README.md
- [ ] QUICK_START.md
- [ ] FEATURES.md
- [ ] PROJECT_SUMMARY.md
- [ ] INSTALLATION_CHECKLIST.md
- [ ] .env
- [ ] .env.example
- [ ] .gitignore
- [ ] start.sh
- [ ] start.bat
- [ ] SAMPLE_WORDS.txt

**Server Files:**
- [ ] server/index.js
- [ ] server/routes/dict.js
- [ ] server/routes/pronunciation.js
- [ ] server/routes/image.js
- [ ] server/package.json (created by npm install)

**Client Files:**
- [ ] client/package.json
- [ ] client/index.html
- [ ] client/vite.config.ts
- [ ] client/tsconfig.json
- [ ] client/tsconfig.node.json
- [ ] client/src/main.tsx
- [ ] client/src/App.tsx
- [ ] client/src/App.css
- [ ] client/src/index.css
- [ ] client/src/types.ts
- [ ] client/src/components/WordImport.tsx
- [ ] client/src/components/WordImport.css
- [ ] client/src/components/WordDetail.tsx
- [ ] client/src/components/WordDetail.css
- [ ] client/src/components/PracticeMenu.tsx
- [ ] client/src/components/PracticeMenu.css
- [ ] client/src/components/practices/ListeningPractice.tsx
- [ ] client/src/components/practices/FillInPractice.tsx
- [ ] client/src/components/practices/SortLettersPractice.tsx
- [ ] client/src/components/practices/SpellingPractice.tsx
- [ ] client/src/components/practices/ImageFillPractice.tsx
- [ ] client/src/components/practices/PronunciationTest.tsx
- [ ] client/src/components/practices/Practice.css

## Starting the Application

### Option 1: Using Startup Script (Recommended)

**Mac/Linux:**
```bash
./start.sh
```
- [ ] Script runs without errors
- [ ] Server message appears: "Server is running on port 3001"
- [ ] Vite message appears: "Local: http://localhost:3000"

**Windows:**
```bash
start.bat
```
- [ ] Batch file runs without errors
- [ ] Server message appears: "Server is running on port 3001"
- [ ] Vite message appears: "Local: http://localhost:3000"

### Option 2: Manual Start

```bash
npm run dev
```
- [ ] Both server and client start
- [ ] No red error messages
- [ ] Two processes running simultaneously

## Accessing the Application

- [ ] Open browser to http://localhost:3000
- [ ] Page loads successfully
- [ ] "English Learning System" header visible
- [ ] Word import interface displays correctly
- [ ] No console errors (press F12 to check)

## Testing Core Functionality

### Test 1: Word Import
1. [ ] Copy sample words from SAMPLE_WORDS.txt
2. [ ] Paste into word input box
3. [ ] Click "Import Words" button
4. [ ] Wait for import to complete (10-30 seconds)
5. [ ] Practice menu appears with word count
6. [ ] No error messages displayed

### Test 2: Word Details
1. [ ] Click on any word from the practice menu
2. [ ] Word detail page opens
3. [ ] [ ] English word shows in large text
4. [ ] [ ] Chinese translation visible
5. [ ] [ ] Image displays
6. [ ] [ ] US and UK pronunciation phonetics show
7. [ ] [ ] Audio buttons are clickable

### Test 3: Listening Practice
1. [ ] Select "Listening Practice" from menu
2. [ ] Click "Play Word" button
3. [ ] Sound plays (you should hear a word)
4. [ ] 4 option buttons appear
5. [ ] Click correct option
6. [ ] Feedback appears (green highlight)
7. [ ] Score updates
8. [ ] Next button appears

### Test 4: Fill in the Blanks
1. [ ] Select "Fill in the Blanks" from menu
2. [ ] Word displays with blanks
3. [ ] Click letter buttons to fill blanks
4. [ ] Correct word shows in green
5. [ ] Incorrect attempt shows error message
6. [ ] Score tracking works

### Test 5: Sort Letters
1. [ ] Select "Sort Letters" from menu
2. [ ] Scrambled letters display
3. [ ] Click letters in order
4. [ ] Selected letters appear at top
5. [ ] Correct arrangement shows in green
6. [ ] Wrong order shows error only

### Test 6: Spelling Practice
1. [ ] Select "Spelling Practice"
2. [ ] Click "Play Sound" button
3. [ ] Type word in input field
4. [ ] Press Enter or click "Check Answer"
5. [ ] Feedback appears
6. [ ] Score updates

### Test 7: Image Fill-in
1. [ ] Select "Image Fill-in"
2. [ ] Image displays clearly
3. [ ] Chinese meaning shows
4. [ ] Type English word
5. [ ] Press Enter
6. [ ] Feedback appears with correct answer

### Test 8: Pronunciation Test
1. [ ] Select "Pronunciation Test"
2. [ ] Large circular record button appears
3. [ ] Click record button
4. [ ] Say the word into microphone
5. [ ] Stop recording
6. [ ] Accuracy percentage displays
7. [ ] Feedback message appears
8. [ ] Score updates if accuracy ≥80%

## Troubleshooting Checks

### If Server Won't Start
- [ ] Port 3001 is not in use (try: `lsof -i :3001` on Mac/Linux)
- [ ] No Node process already running on that port
- [ ] Try changing PORT in .env
- [ ] Restart terminal/command prompt
- [ ] Check internet connection

### If Client Won't Load
- [ ] Server is running (check terminal)
- [ ] Vite dev server started successfully
- [ ] Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- [ ] Check browser console for errors (F12)
- [ ] Clear browser cache

### If Audio Won't Play
- [ ] Volume is turned on
- [ ] Browser allows audio playback
- [ ] Internet connection is stable
- [ ] Cambridge Dictionary is accessible
- [ ] Try different browser (Chrome recommended)

### If Images Don't Load
- [ ] Internet connection is working
- [ ] This is normal - system uses placeholder
- [ ] Add API keys in .env for real images
- [ ] Try refreshing page

### If Pronunciation Test Fails
- [ ] Using Chrome, Edge, or Brave browser
- [ ] Microphone is connected and working
- [ ] Browser has microphone permission
- [ ] No other app is using microphone
- [ ] System language is set to English

## Performance Checks

- [ ] Page loads in under 3 seconds
- [ ] Button clicks respond immediately
- [ ] Practice exercises load smoothly
- [ ] No lag during typing
- [ ] Audio plays without stuttering
- [ ] No memory leaks (Monitor in DevTools)

## Configuration Options

### Optional: Add Image API Keys

For better quality images, add API keys:

1. [ ] Get Unsplash API key from https://unsplash.com/developers
2. [ ] Get Pixabay API key from https://pixabay.com/api/docs/
3. [ ] Edit .env file
4. [ ] Add keys: `UNSPLASH_API_KEY=your_key`
5. [ ] Restart application
6. [ ] Images should load faster

### Optional: Change Port

If port 3001 conflicts:

1. [ ] Edit .env file
2. [ ] Change `PORT=3002` (or any free port)
3. [ ] Restart server
4. [ ] Update proxy in client/vite.config.ts

## First Time Usage Guide

1. [ ] Application is running
2. [ ] You can access http://localhost:3000
3. [ ] Word list is imported
4. [ ] You can see practice menu
5. [ ] You understand which exercise to try first

## Recommended First Session

1. [ ] Import 10 sample words
2. [ ] Try Listening Practice (easiest)
3. [ ] View word details (see pronunciation)
4. [ ] Try Image Fill-in (visual learning)
5. [ ] Try Fill in Blanks (slightly harder)
6. [ ] Try Sort Letters (requires recall)
7. [ ] Try Spelling Practice (harder)
8. [ ] Try Pronunciation Test (assessment)

## Success Indicators

✅ You'll know it's working when:
- [ ] Browser shows the app at localhost:3000
- [ ] You can import words successfully
- [ ] Practice exercises load
- [ ] Scores track correctly
- [ ] Feedback appears appropriately
- [ ] No red error messages in console

## Next Steps After Setup

1. [ ] Read QUICK_START.md for overview
2. [ ] Read FEATURES.md for detailed features
3. [ ] Import your own word list
4. [ ] Customize colors in client/src/index.css
5. [ ] Deploy to server (see README.md)

## Getting Help

- [ ] Check README.md for detailed documentation
- [ ] Check FEATURES.md for feature details
- [ ] Check browser console for error messages (F12)
- [ ] Try restarting the application
- [ ] Check internet connection status
- [ ] Try different browser

## Completion Status

Once all items are checked:
- ✅ Installation is complete
- ✅ Application is running
- ✅ All features are working
- ✅ Ready to start learning!

---

**Congratulations! 🎉 Your English Learning System is ready!**

Start learning: http://localhost:3000
