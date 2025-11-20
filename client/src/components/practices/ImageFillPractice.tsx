import { useState, useEffect } from 'react';
import { Word } from '../../types';
import './Practice.css';

interface ImageFillPracticeProps {
  words: Word[];
  onBack: () => void;
}

export default function ImageFillPractice({ words, onBack }: ImageFillPracticeProps) {
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
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
    setUserInput('');
    setAnswered(false);
    setShowError(false);
  }, [currentIndex]);

  const handleSubmit = () => {
    const correct =
      userInput.toLowerCase().trim() === currentWord.english.toLowerCase();

    if (correct) {
      setIsCorrect(true);
      setScore(score + 1);
      playSuccessSound();
      setTimeout(() => {
        handleNext();
      }, 500);
    } else {
      setShowError(true);
      // 错误时不清除输入，用户可以继续尝试
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
          <h2>🖼️ 看图填词</h2>
          <div className="progress">
            {currentIndex + 1} / {shuffledWords.length}
          </div>
          <div className="score">得分: {score}</div>
        </div>

        <div className="practice-content">
          <p className="instruction">看图并输入单词</p>

          {currentWord?.imageUrl && (
            <div className="image-container">
              <img
                src={currentWord.imageUrl}
                alt={currentWord.english}
                className="word-image-practice"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/400x300?text=' +
                    encodeURIComponent(currentWord.chinese);
                }}
              />
            </div>
          )}

          <p className="image-hint">
            <span className="hint-label">意思：</span><strong className="hint-chinese">✨ {currentWord?.chinese} ✨</strong>
          </p>

          <input
            type="text"
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
              setShowError(false);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !answered) {
                handleSubmit();
              }
            }}
            placeholder="在这里输入单词..."
            className="input-field"
            disabled={answered}
            autoFocus
          />

          {showError && (
            <div className="feedback error">
              ❌ 不太对。再试一次！
            </div>
          )}
        </div>

        <div className="practice-footer">
          <button className="btn-back-practice" onClick={onBack}>
            ← 返回
          </button>
          {!answered && userInput && (
            <button className="btn-next" onClick={handleSubmit}>
              检查答案 ✓
            </button>
          )}
        </div>
      </div>

      <style>{`
        .image-container {
          text-align: center;
          margin: 20px 0;
        }

        .image-hint {
          text-align: center;
          margin: 25px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .hint-label {
          font-size: 18px;
          color: #666;
          font-weight: 500;
        }

        .hint-chinese {
          font-size: 28px;
          font-weight: 700;
          color: #ff6b9d;
          background: linear-gradient(135deg, #ffe5ec 0%, #fff9e6 100%);
          padding: 15px 25px;
          border-radius: 18px;
          border: 3px dashed #ff6b9d;
          box-shadow: 0 4px 15px rgba(255, 107, 157, 0.2);
          display: inline-block;
          letter-spacing: 1px;
          font-family: 'Comic Sans MS', 'Microsoft YaHei', cursive, sans-serif;
          animation: bounce 0.5s ease;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
