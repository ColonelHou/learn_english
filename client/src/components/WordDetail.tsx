import { useState } from 'react';
import axios from 'axios';
import { Word } from '../types';
import './WordDetail.css';

interface MnemonicSuggestion {
  type: string;
  content: string;
  icon: string;
}

interface WordDetailProps {
  word: Word;
  onBack: () => void;
  pronounceTimes: number;
}

export default function WordDetail({ word, onBack, pronounceTimes }: WordDetailProps) {
  const [mnemonic, setMnemonic] = useState(word.mnemonic || '');
  const [savedMnemonic, setSavedMnemonic] = useState(word.mnemonic || '');
  const [suggestions, setSuggestions] = useState<MnemonicSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const handleGetSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      setShowSuggestions(true);
      const encodedChinese = encodeURIComponent(word.chinese);
      const response = await axios.get(
        `/api/mnemonic/${word.english}/${encodedChinese}`
      );

      if (response.data.success && response.data.data.suggestions) {
        setSuggestions(response.data.data.suggestions);
      }
    } catch (error) {
      console.error('Error getting mnemonic suggestions:', error);
      alert('无法获取助记建议，请稍后重试');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleUseSuggestion = (content: string) => {
    setMnemonic(content);
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

          <button
            className="btn-generate-suggestions"
            onClick={handleGetSuggestions}
            disabled={loadingSuggestions}
          >
            {loadingSuggestions ? '生成中...' : '✨ 获取助记建议'}
          </button>

          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-panel">
              <h4>📌 推荐的助记方法</h4>
              <div className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="suggestion-item">
                    <div className="suggestion-header">
                      <span className="suggestion-icon">{suggestion.icon}</span>
                      <span className="suggestion-type">{suggestion.type}</span>
                    </div>
                    <div className="suggestion-content">
                      {suggestion.content}
                    </div>
                    <button
                      className="btn-use-suggestion"
                      onClick={() => handleUseSuggestion(suggestion.content)}
                    >
                      ✓ 使用这个建议
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <textarea
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
            placeholder="例如：pest - 拍死它 (因为pest是害虫，'拍死它'谐音记忆)"
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
