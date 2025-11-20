import { useState, useEffect } from 'react';
import { Word } from '../../types';
import './Practice.css';

interface ListeningPracticeProps {
  words: Word[];
  onBack: () => void;
}

export default function ListeningPractice({ words, onBack }: ListeningPracticeProps) {
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<Word[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<Word | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  // 初始化：乱序单词列表
  useEffect(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
  }, [words]);

  const currentWord = shuffledWords[currentIndex];

  useEffect(() => {
    generateOptions();
  }, [currentIndex, shuffledWords]);

  const generateOptions = () => {
    if (!shuffledWords.length || !currentWord) return;

    const correct = currentWord;
    setCorrectAnswer(correct);

    // Get 3 random wrong answers
    const available = shuffledWords.filter((w, i) => i !== currentIndex);
    const shuffled = available.sort(() => Math.random() - 0.5);
    const wrong = shuffled.slice(0, 3);

    // Combine and shuffle
    const allOptions = [correct, ...wrong].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setAnswered(false);
  };

  const playAudio = () => {
    if (!currentWord.audioUrls.us) {
      alert('Audio not available');
      return;
    }

    const audio = new Audio(currentWord.audioUrls.us);
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
  };

  const handleSelectOption = (selected: Word) => {
    const correct = selected.id === correctAnswer?.id;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
      // 播放成功音频并自动进入下一个单词
      playSuccessSound();
      setTimeout(() => {
        handleNext();
      }, 500); // 暂停500毫秒让用户看到反馈
    } else {
      // 错误时停留在当前页面
      setAnswered(true);
    }
  };

  const playSuccessSound = () => {
    // 创建成功提示音
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800; // 高音
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
      // Show final score
      setTimeout(() => {
        alert(`完成！您答对了 ${score + (isCorrect ? 1 : 0)}/${shuffledWords.length} 个单词！`);
        onBack(); // 自动返回首页
      }, 500);
    }
  };

  return (
    <div className="practice-container">
      <div className="practice-card">
        <div className="practice-header">
          <h2>🎧 听力选词</h2>
          <div className="progress">
            {currentIndex + 1} / {shuffledWords.length}
          </div>
          <div className="score">得分: {score}</div>
        </div>

        <div className="practice-content">
          <p className="instruction">听发音，选择正确的单词</p>

          <button className="btn-play-large" onClick={playAudio}>
            🔊 播放单词
          </button>

          <div className="options-grid">
            {options.map((option) => (
              <button
                key={option.id}
                className={`option-btn ${answered ? (option.id === correctAnswer?.id ? 'correct' : 'wrong') : ''}`}
                onClick={() => !answered && handleSelectOption(option)}
                disabled={answered}
              >
                <span className="option-text">{option.english}</span>
                <span className="option-chinese">{option.chinese}</span>
              </button>
            ))}
          </div>

          {answered && (
            <div className={`feedback ${isCorrect ? 'success' : 'error'}`}>
              {isCorrect ? '✅ 正确！' : `❌ 错误！正确答案是 ${correctAnswer?.english}`}
            </div>
          )}
        </div>

        <div className="practice-footer">
          <button className="btn-back-practice" onClick={onBack}>
            ← 返回
          </button>
          {answered && !isCorrect && (
            <button className="btn-next" onClick={() => setAnswered(false)}>
              再试一次 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
