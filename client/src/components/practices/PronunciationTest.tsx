import { useState, useEffect, useRef } from 'react';
import { Word } from '../../types';
import './Practice.css';

interface PronunciationTestProps {
  words: Word[];
  onBack: () => void;
}

export default function PronunciationTest({ words, onBack }: PronunciationTestProps) {
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [recognitionAvailable, setRecognitionAvailable] = useState(true);
  const [feedback, setFeedback] = useState('');

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
  }, [words]);

  const currentWord = shuffledWords[currentIndex];

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecognitionAvailable(false);
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
      setFeedback('🎤 Listening...');
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current.onerror = (event: any) => {
      setFeedback(`❌ Error: ${event.error}`);
      setIsRecording(false);
    };

    recognitionRef.current.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript = event.results[i][0].transcript.toLowerCase().trim();
        }
      }

      if (transcript) {
        calculateAccuracy(transcript);
      }
    };

    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    setAccuracy(null);
    setAnswered(false);
    setFeedback('');
  }, [currentIndex]);

  const calculateAccuracy = (transcript: string) => {
    const expected = currentWord.english.toLowerCase();
    const userWords = transcript.split(' ');
    const expectedWords = expected.split(' ');

    // Find the closest match
    let matchedWord = '';
    let maxSimilarity = 0;

    for (const word of userWords) {
      const similarity = calculateSimilarity(word, expected);
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        matchedWord = word;
      }
    }

    // Calculate accuracy percentage
    const accuracyPercent = Math.round(maxSimilarity * 100);

    setAccuracy(accuracyPercent);

    if (accuracyPercent >= 80) {
      setFeedback(`✅ 太棒了！准确度: ${accuracyPercent}%`);
      setScore(score + 1);
      setAnswered(true);
      setTimeout(() => {
        handleNext();
      }, 1000);
    } else if (accuracyPercent >= 60) {
      setFeedback(`⚠️ 不错！准确度: ${accuracyPercent}%。再试一次。`);
      setAnswered(true);
    } else {
      setFeedback(`❌ 准确度: ${accuracyPercent}%。再试一次！`);
      setAnswered(true);
    }
  };

  const calculateSimilarity = (str1: string, str2: string) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = getEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const getEditDistance = (s1: string, s2: string) => {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  };

  const handleStartRecording = () => {
    if (!recognitionRef.current) return;
    setAccuracy(null);
    setFeedback('');
    recognitionRef.current.start();
  };

  const handleStopRecording = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
  };

  const handleNext = () => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAccuracy(null);
      setAnswered(false);
      setFeedback('');
    } else {
      setTimeout(() => {
        alert(`完成！您得到 ${score}/${shuffledWords.length} 个单词准确度 ≥80%！`);
        onBack();
      }, 500);
    }
  };

  if (!recognitionAvailable) {
    return (
      <div className="practice-container">
        <div className="practice-card">
          <div className="feedback error">
            ⚠️ 您的浏览器不支持语音识别。请使用 Chrome、Edge 或其他基于 Chromium 的浏览器。
          </div>
          <button className="btn-back-practice" onClick={onBack}>
            ← 返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="practice-container">
      <div className="practice-card">
        <div className="practice-header">
          <h2>🎤 发音检测</h2>
          <div className="progress">
            {currentIndex + 1} / {shuffledWords.length}
          </div>
          <div className="score">得分: {score}</div>
        </div>

        <div className="practice-content">
          <p className="instruction">大声说出单词，我们会检查你的发音</p>

          <div className="word-display">{currentWord?.english}</div>
          <p className="instruction">{currentWord?.chinese}</p>

          {accuracy === null && (
            <div className="recording-controls">
              <button
                className={`btn-record ${isRecording ? 'recording' : ''}`}
                onClick={handleStartRecording}
                disabled={isRecording}
              >
                🎤 {isRecording ? '录音中...' : '开始录音'}
              </button>
              {isRecording && (
                <button className="btn-stop" onClick={handleStopRecording}>
                  ⏹️ 停止录音
                </button>
              )}
            </div>
          )}

          {accuracy !== null && (
            <div className="accuracy-result">
              <div className="accuracy-circle">
                <span className="accuracy-value">{accuracy}%</span>
              </div>
              {feedback && <div className="feedback-text">{feedback}</div>}
            </div>
          )}

          {feedback && <div className="feedback">{feedback}</div>}
        </div>

        <div className="practice-footer">
          <button className="btn-back-practice" onClick={onBack}>
            ← 返回
          </button>
          {answered && accuracy !== null && accuracy >= 80 === false && (
            <button className="btn-next" onClick={() => {
              setAccuracy(null);
              setFeedback('');
            }}>
              再试一次 →
            </button>
          )}
          {answered && accuracy !== null && accuracy >= 80 && (
            <button className="btn-next" onClick={handleNext}>
              下一个 {currentIndex === shuffledWords.length - 1 ? '(完成)' : '→'}
            </button>
          )}
        </div>
      </div>

      <style>{`
        .recording-controls {
          display: flex;
          gap: 15px;
          margin: 30px 0;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-record {
          padding: 20px 40px;
          background-color: var(--danger-color);
          color: white;
          border: none;
          border-radius: 50%;
          width: 150px;
          height: 150px;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .btn-record:hover:not(:disabled) {
          transform: scale(1.1);
          box-shadow: 0 8px 16px rgba(244, 67, 54, 0.4);
        }

        .btn-record:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-record.recording {
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(244, 67, 54, 0);
          }
        }

        .btn-stop {
          padding: 15px 30px;
          background-color: var(--secondary-color);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-stop:hover {
          transform: translateY(-2px);
          background-color: #0b7dda;
        }

        .accuracy-result {
          margin: 30px 0;
          text-align: center;
        }

        .accuracy-circle {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: conic-gradient(
            var(--primary-color) 0% ${accuracy}%,
            #f0f0f0 ${accuracy}% 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .accuracy-value {
          background: white;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: bold;
          color: var(--primary-color);
        }

        .feedback-text {
          color: var(--text-secondary);
          font-size: 16px;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}
