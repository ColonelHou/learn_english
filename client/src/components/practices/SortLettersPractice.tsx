import { useState, useEffect } from 'react';
import { Word } from '../../types';
import './Practice.css';

interface SortLettersPracticeProps {
  words: Word[];
  onBack: () => void;
}

export default function SortLettersPractice({ words, onBack }: SortLettersPracticeProps) {
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
  }, [words]);

  const currentWord = shuffledWords[currentIndex];

  useEffect(() => {
    initializePuzzle();
  }, [currentIndex, shuffledWords]);

  const initializePuzzle = () => {
    // Guard against undefined currentWord
    if (!currentWord) return;

    // Scramble the letters
    const letters = currentWord.english.split('');
    const scrambled = [...letters].sort(() => Math.random() - 0.5);
    setScrambledLetters(scrambled);
    setSelectedOrder([]);
    setAnswered(false);
    setShowError(false);
  };

  const handleSelectLetter = (index: number) => {
    if (selectedOrder.includes(index)) {
      // Remove if already selected
      setSelectedOrder(selectedOrder.filter((i) => i !== index));
    } else {
      // Add to selected
      const newSelection = [...selectedOrder, index];
      setSelectedOrder(newSelection);

      // Check if complete
      if (newSelection.length === scrambledLetters.length) {
        checkAnswer(newSelection);
      }
    }
    setShowError(false);
  };

  const checkAnswer = (selection: number[]) => {
    // Guard against undefined currentWord
    if (!currentWord) return;

    const userWord = selection.map((i) => scrambledLetters[i]).join('');
    const correct = userWord.toLowerCase() === currentWord.english.toLowerCase();

    if (correct) {
      setIsCorrect(true);
      setScore(score + 1);
      playSuccessSound();
      setTimeout(() => {
        handleNext();
      }, 500);
    } else {
      setShowError(true);
      setSelectedOrder([]);
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

  return (
    <div className="practice-container">
      <div className="practice-card">
        <div className="practice-header">
          <h2>🔤 字母排序</h2>
          <div className="progress">
            {currentIndex + 1} / {shuffledWords.length}
          </div>
          <div className="score">得分: {score}</div>
        </div>

        <div className="practice-content">
          {currentWord ? (
            <>
              <p className="instruction word-meaning">✨ {currentWord.chinese} ✨</p>

              <div className="selected-word">
                {selectedOrder.length > 0 ? (
                  selectedOrder.map((idx, pos) => (
                    <div
                      key={pos}
                      className="selected-letter"
                      onClick={() => setSelectedOrder(selectedOrder.filter((_, i) => i !== pos))}
                    >
                      {scrambledLetters[idx]}
                    </div>
                  ))
                ) : (
                  <div className="selected-placeholder">按顺序选择字母</div>
                )}
              </div>

              <div className="letters-grid">
                {scrambledLetters.map((letter, index) => (
                  <button
                    key={index}
                    className={`letter-btn ${selectedOrder.includes(index) ? 'selected' : ''}`}
                    onClick={() => handleSelectLetter(index)}
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {showError && (
                <div className="feedback error">
                  ❌ 没有拼对！再试一次。
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
        .selected-word {
          display: flex;
          gap: 10px;
          min-height: 60px;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 8px;
          margin-bottom: 20px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
        }

        .selected-placeholder {
          color: var(--text-secondary);
          font-size: 16px;
        }

        .selected-letter {
          background-color: var(--primary-color);
          color: white;
          padding: 15px 20px;
          border-radius: 8px;
          font-weight: bold;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .selected-letter:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
        }
      `}</style>
    </div>
  );
}
