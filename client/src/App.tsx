import { useState } from 'react';
import './App.css';
import { Word } from './types';
import WordImport from './components/WordImport';
import WordDetail from './components/WordDetail';
import PracticeMenu from './components/PracticeMenu';
import ListeningPractice from './components/practices/ListeningPractice';
import FillInPractice from './components/practices/FillInPractice';
import SortLettersPractice from './components/practices/SortLettersPractice';
import SpellingPractice from './components/practices/SpellingPractice';
import ImageFillPractice from './components/practices/ImageFillPractice';
import PronunciationTest from './components/practices/PronunciationTest';
import WordList from './components/WordList';

type Page =
  | 'home'
  | 'word-detail'
  | 'practice-menu'
  | 'listening'
  | 'fill-in'
  | 'sort-letters'
  | 'spelling'
  | 'image-fill'
  | 'pronunciation-test'
  | 'word-list';

function App() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [settings, setSettings] = useState({
    pronounceTimes: 3
  });

  const handleWordsImported = (importedWords: Word[]) => {
    setWords(importedWords);
    setCurrentPage('practice-menu');
  };

  const handleSelectWord = (word: Word) => {
    setCurrentWord(word);
    setCurrentPage('word-detail');
  };

  const handleStartPractice = (practiceType: string) => {
    switch (practiceType) {
      case 'listening':
        setCurrentPage('listening');
        break;
      case 'fill-in':
        setCurrentPage('fill-in');
        break;
      case 'sort-letters':
        setCurrentPage('sort-letters');
        break;
      case 'spelling':
        setCurrentPage('spelling');
        break;
      case 'image-fill':
        setCurrentPage('image-fill');
        break;
      case 'pronunciation-test':
        setCurrentPage('pronunciation-test');
        break;
      case 'word-list':
        setCurrentPage('word-list');
        break;
      default:
        break;
    }
  };

  const handleBackToPracticeMenu = () => {
    setCurrentPage('practice-menu');
  };

  const handleBackToHome = () => {
    setWords([]);
    setCurrentWord(null);
    setCurrentPage('home');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 英语单词学习系统</h1>
        {words.length > 0 && (
          <div className="header-info">
            <span>已加载单词：{words.length}个</span>
            {currentPage !== 'home' && (
              <button className="btn-back" onClick={handleBackToHome}>
                ← 返回首页
              </button>
            )}
          </div>
        )}
      </header>

      <main className="app-main">
        {currentPage === 'home' && (
          <WordImport onWordsImported={handleWordsImported} />
        )}

        {currentPage === 'word-detail' && currentWord && (
          <WordDetail
            word={currentWord}
            onBack={handleBackToPracticeMenu}
            pronounceTimes={settings.pronounceTimes}
          />
        )}

        {currentPage === 'practice-menu' && (
          <PracticeMenu
            words={words}
            onSelectWord={handleSelectWord}
            onStartPractice={handleStartPractice}
            onBack={handleBackToHome}
          />
        )}

        {currentPage === 'listening' && (
          <ListeningPractice
            words={words}
            onBack={handleBackToPracticeMenu}
          />
        )}

        {currentPage === 'fill-in' && (
          <FillInPractice
            words={words}
            onBack={handleBackToPracticeMenu}
          />
        )}

        {currentPage === 'sort-letters' && (
          <SortLettersPractice
            words={words}
            onBack={handleBackToPracticeMenu}
          />
        )}

        {currentPage === 'spelling' && (
          <SpellingPractice
            words={words}
            onBack={handleBackToPracticeMenu}
          />
        )}

        {currentPage === 'image-fill' && (
          <ImageFillPractice
            words={words}
            onBack={handleBackToPracticeMenu}
          />
        )}

        {currentPage === 'pronunciation-test' && (
          <PronunciationTest
            words={words}
            onBack={handleBackToPracticeMenu}
          />
        )}

        {currentPage === 'word-list' && (
          <WordList
            words={words}
            onBack={handleBackToPracticeMenu}
          />
        )}
      </main>
    </div>
  );
}

export default App;
