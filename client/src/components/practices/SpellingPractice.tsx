import { useState, useEffect } from 'react';
import { Word } from '../../types';
import './Practice.css';

interface SpellingPracticeProps {
  words: Word[];
  onBack: () => void;
}

export default function SpellingPractice({ words, onBack }: SpellingPracticeProps) {
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showError, setShowError] = useState(false);
  const [playCount, setPlayCount] = useState(0);

  useEffect(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
  }, [words]);

  const currentWord = shuffledWords[currentIndex];

  useEffect(() => {
    setUserInput('');
    setAnswered(false);
    setShowError(false);
    setPlayCount(0);
  }, [currentIndex]);

  const playAudio = () => {
    if (!currentWord.audioUrls.us) {
      alert('Audio not available');
      return;
    }

    const audio = new Audio(currentWord.audioUrls.us);
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
    });

    setPlayCount(playCount + 1);
  };

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
      setUserInput('');
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
          <h2>📝 听音拼写</h2>
          <div className="progress">
            {currentIndex + 1} / {shuffledWords.length}
          </div>
          <div className="score">得分: {score}</div>
        </div>

        <div className="practice-content">
          <p className="instruction">
            听发音并输入单词
          </p>

          <button className="btn-play-large" onClick={playAudio}>
            🔊 播放发音 {playCount > 0 && `(x${playCount})`}
          </button>

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
              ❌ 不对。再听一遍，重新试试！
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
    </div>
  );
}
