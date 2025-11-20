import { useState } from 'react';
import { Word } from '../types';
import './WordDetail.css';

interface WordDetailProps {
  word: Word;
  onBack: () => void;
  pronounceTimes: number;
}

export default function WordDetail({ word, onBack, pronounceTimes }: WordDetailProps) {
  const [mnemonic, setMnemonic] = useState(word.mnemonic || '');
  const [savedMnemonic, setSavedMnemonic] = useState(word.mnemonic || '');

  const handlePlayAudio = (audioUrl: string | null) => {
    if (!audioUrl) {
      alert('Audio not available for this word');
      return;
    }

    // Create and play audio
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
      alert('Could not play audio. Make sure you have internet connection.');
    });
  };

  const handleSaveMnemonic = () => {
    setSavedMnemonic(mnemonic);
    alert('Mnemonic saved! 💾');
  };

  return (
    <div className="word-detail-container">
      <div className="word-detail-card">
        <button className="btn-close" onClick={onBack}>
          ✕
        </button>

        <div className="word-detail-header">
          <h1 className="word-title">{word.english}</h1>
          <p className="word-chinese">{word.chinese}</p>
        </div>

        {word.imageUrl && (
          <div className="word-image-section">
            <img src={word.imageUrl} alt={word.english} className="word-image" />
          </div>
        )}

        <div className="pronunciation-section">
          <h3>🎵 发音</h3>

          <div className="pronunciation-row">
            <div className="pronunciation-item">
              <span className="label">美音:</span>
              <span className="phonetic">{word.phonetics.us || 'N/A'}</span>
              <button
                className="btn-play"
                onClick={() => handlePlayAudio(word.audioUrls.us)}
              >
                🔊 播放 (x{pronounceTimes})
              </button>
            </div>

            <div className="pronunciation-item">
              <span className="label">英音:</span>
              <span className="phonetic">{word.phonetics.uk || 'N/A'}</span>
              <button
                className="btn-play"
                onClick={() => handlePlayAudio(word.audioUrls.uk)}
              >
                🔊 播放 (x{pronounceTimes})
              </button>
            </div>
          </div>
        </div>

        {word.partOfSpeech && (
          <div className="pos-section">
            <h3>📖 词性</h3>
            <p className="pos-text">{word.partOfSpeech}</p>
          </div>
        )}

        <div className="mnemonic-section">
          <h3>💡 助记方法</h3>
          <textarea
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
            placeholder="例如：apple 🍎 - 以 'a' 开头，记住它是红色的水果"
            className="mnemonic-input"
          />
          <button className="btn-save" onClick={handleSaveMnemonic}>
            💾 保存助记
          </button>
          {savedMnemonic && (
            <div className="saved-mnemonic">
              <p><strong>已保存：</strong> {savedMnemonic}</p>
            </div>
          )}
        </div>

        <button className="btn-back-detail" onClick={onBack}>
          ← 返回菜单
        </button>
      </div>
    </div>
  );
}
