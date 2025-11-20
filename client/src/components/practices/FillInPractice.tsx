import { useState, useEffect } from 'react';
import { Word } from '../../types';
import './Practice.css';

interface FillInPracticeProps {
  words: Word[];
  onBack: () => void;
}

export default function FillInPractice({ words, onBack }: FillInPracticeProps) {
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<number[]>([]);
  const [availableLetters, setAvailableLetters] = useState<number[]>([]);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showError, setShowError] = useState(false);

  // 初始化：乱序单词列表
  useEffect(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
  }, [words]);

  const currentWord = shuffledWords[currentIndex];
  const wordLength = currentWord?.english.length || 0;

  useEffect(() => {
    initializePuzzle();
  }, [currentIndex, shuffledWords, wordLength]);

  const initializePuzzle = () => {
    // Guard against undefined currentWord
    if (!currentWord || wordLength === 0) return;

    // Create array of indices for all letters
    const allLetters = Array.from({ length: wordLength }, (_, i) => i);
    // Randomly select 2-3 indices to hide (depending on word length)
    const numToHide = Math.min(Math.max(Math.ceil(wordLength / 3), 2), 4);
    const shuffled = allLetters.sort(() => Math.random() - 0.5);
    const hiddenIndices = shuffled.slice(0, numToHide);

    setAvailableLetters(hiddenIndices);
    setSelectedLetters(Array(numToHide).fill(-1));
    setAnswered(false);
    setShowError(false);
  };

  const handleSelectLetter = (letterIndex: number, selectedIndex: number) => {
    const newSelected = [...selectedLetters];
    newSelected[selectedIndex] = letterIndex;
    setSelectedLetters(newSelected);
    setShowError(false);

    // Check if complete
    if (!newSelected.includes(-1)) {
      checkAnswer(newSelected);
    }
  };

  const handleRemoveLetter = (selectedIndex: number) => {
    const newSelected = [...selectedLetters];
    newSelected[selectedIndex] = -1;
    setSelectedLetters(newSelected);
    setShowError(false);
  };

  const checkAnswer = (selected: number[]) => {
    // Guard against undefined currentWord
    if (!currentWord) return;

    const wordLetters = currentWord.english.split('');

    // Check if the word is spelled correctly
    const fullWord = wordLetters.map((letter, idx) => {
      if (availableLetters.includes(idx)) {
        const selectedIdx = availableLetters.indexOf(idx);
        return wordLetters[selected[selectedIdx]];
      }
      return letter;
    }).join('');

    const isCorrectAnswer = fullWord.toLowerCase() === currentWord.english.toLowerCase();
    setIsCorrect(isCorrectAnswer);

    if (isCorrectAnswer) {
      setScore(score + 1);
      playSuccessSound();
      playPraiseVoice();
      setTimeout(() => {
        handleNext();
      }, 500);
    } else {
      setShowError(true);
      setSelectedLetters(Array(availableLetters.length).fill(-1));
    }
  };

  const playSuccessSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const playPraiseVoice = () => {
    const praiseList = [
      { text: '太棒了！', pitch: 1.3, rate: 0.9 },
      { text: '你真厉害！', pitch: 1.2, rate: 0.85 },
      { text: '完美！', pitch: 1.4, rate: 0.95 },
      { text: '了不起！', pitch: 1.25, rate: 0.88 },
      { text: '超级聪明！', pitch: 1.35, rate: 0.9 },
      { text: '天才表现！', pitch: 1.3, rate: 0.87 },
      { text: '哇！真不敢相信！', pitch: 1.4, rate: 0.8 },
      { text: '精彩绝伦！', pitch: 1.25, rate: 0.85 },
      { text: '无与伦比！', pitch: 1.3, rate: 0.88 },
      { text: '顶级表现！', pitch: 1.2, rate: 0.9 },
      { text: '继续加油！', pitch: 1.35, rate: 0.9 },
      { text: '你进步真快！', pitch: 1.15, rate: 0.85 },
      { text: '越来越好了！', pitch: 1.25, rate: 0.88 },
      { text: '势不可挡！', pitch: 1.3, rate: 0.92 },
      { text: '火力全开！', pitch: 1.4, rate: 0.9 },
      { text: '乘风破浪！', pitch: 1.25, rate: 0.87 },
      { text: '勇往直前！', pitch: 1.2, rate: 0.88 },
      { text: '再接再厉！', pitch: 1.3, rate: 0.85 },
      { text: '势如破竹！', pitch: 1.35, rate: 0.9 },
      { text: '进步神速！', pitch: 1.25, rate: 0.87 },
      { text: '你真行！', pitch: 1.15, rate: 0.9 },
      { text: '好样的！', pitch: 1.3, rate: 0.88 },
      { text: '干得漂亮！', pitch: 1.25, rate: 0.85 },
      { text: '真聪明！', pitch: 1.2, rate: 0.9 },
      { text: '反应真快！', pitch: 1.3, rate: 0.87 },
      { text: '思路清晰！', pitch: 1.15, rate: 0.88 },
      { text: '观察力强！', pitch: 1.25, rate: 0.85 },
      { text: '记忆力超群！', pitch: 1.2, rate: 0.87 },
      { text: '举一反三！', pitch: 1.3, rate: 0.9 },
      { text: '一点就通！', pitch: 1.25, rate: 0.88 }
    ];
    const randomItem = praiseList[Math.floor(Math.random() * praiseList.length)];
    const utterance = new SpeechSynthesisUtterance(randomItem.text);
    utterance.lang = 'zh-CN';
    utterance.rate = randomItem.rate;
    utterance.pitch = randomItem.pitch;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setTimeout(() => {
        alert(`完成！您答对了 ${score + 1}/${shuffledWords.length} 个单词！`);
        onBack();
      }, 500);
    }
  };

  const renderWord = () => {
    // Guard against undefined currentWord
    if (!currentWord) return null;

    const wordLetters = currentWord.english.split('');
    return wordLetters.map((letter, idx) => {
      if (availableLetters.includes(idx)) {
        const availIndex = availableLetters.indexOf(idx);
        const selectedIdx = selectedLetters[availIndex];
        if (selectedIdx !== -1) {
          return (
            <span
              key={idx}
              className="blank-filled"
              onClick={() => handleRemoveLetter(availIndex)}
            >
              {wordLetters[selectedIdx]}
            </span>
          );
        }
        return (
          <span key={idx} className="blank-empty">
            _
          </span>
        );
      }
      return (
        <span key={idx} className="letter-visible">
          {letter}
        </span>
      );
    });
  };

  return (
    <div className="practice-container">
      <div className="practice-card">
        <div className="practice-header">
          <h2>✏️ 单词补全</h2>
          <div className="progress">
            {currentIndex + 1} / {shuffledWords.length}
          </div>
          <div className="score">得分: {score}</div>
        </div>

        <div className="practice-content">
          {currentWord ? (
            <>
              <p className="instruction word-meaning">✨ {currentWord.chinese} ✨</p>

              <div className="word-display">{renderWord()}</div>

              <div className="letters-grid">
                {availableLetters.map((letterIdx, i) => (
                  <button
                    key={i}
                    className="letter-btn"
                    onClick={() =>
                      selectedLetters[i] === -1 && handleSelectLetter(letterIdx, i)
                    }
                    disabled={selectedLetters[i] !== -1}
                  >
                    {currentWord.english[letterIdx]}
                  </button>
                ))}
              </div>

              {showError && (
                <div className="feedback error">
                  ❌ 再试一次！(加油！)
                </div>
              )}
            </>
          ) : (
            <p className="instruction">加载中...</p>
          )}
        </div>

        <div className="practice-footer">
          <button className="btn-back-practice" onClick={onBack}>
            ← 返回
          </button>
        </div>
      </div>

      <style>{`
        .blank-empty {
          display: inline-block;
          width: 30px;
          height: 35px;
          border-bottom: 2px solid var(--primary-color);
          text-align: center;
          margin: 0 5px;
          color: transparent;
        }

        .blank-filled {
          display: inline-block;
          min-width: 30px;
          margin: 0 5px;
          color: var(--primary-color);
          font-weight: bold;
          cursor: pointer;
          padding: 5px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .blank-filled:hover {
          background-color: #ffe0b2;
        }

        .letter-visible {
          display: inline-block;
          margin: 0 5px;
          color: var(--text-primary);
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
