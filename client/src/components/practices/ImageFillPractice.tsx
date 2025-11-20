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
      playPraiseVoice();
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
