import { useState } from 'react';
import { Word } from '../types';
import './WordList.css';

interface WordListProps {
  words: Word[];
  onBack: () => void;
}

export default function WordList({ words, onBack }: WordListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const filteredWords = words.filter(
    (word) =>
      word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.chinese.includes(searchTerm)
  );

  const playAudio = (audioUrl: string | null, wordId: string) => {
    if (!audioUrl) {
      alert('该单词没有音频');
      return;
    }

    // Stop any currently playing audio
    if (playingAudio) {
      const audio = document.getElementById(playingAudio) as HTMLAudioElement;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }

    const audio = new Audio(audioUrl);
    audio.id = `audio-${wordId}`;
    audio.onended = () => setPlayingAudio(null);

    audio.play().catch((error) => {
      console.error('Failed to play audio:', error);
      alert('无法播放音频');
    });

    setPlayingAudio(`audio-${wordId}`);
  };

  return (
    <div className="word-list-container">
      <div className="word-list-card">
        <div className="word-list-header">
          <h2>📖 词汇表</h2>
          <p>共 <strong>{words.length}</strong> 个单词</p>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="搜索单词（英文或中文）..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-count">搜索结果：{filteredWords.length}</span>
        </div>

        <div className="word-list-content">
          {filteredWords.length === 0 ? (
            <div className="no-results">暂无搜索结果</div>
          ) : (
            <table className="word-table">
              <thead>
                <tr>
                  <th>英文</th>
                  <th>音标</th>
                  <th>中文</th>
                  <th>词性</th>
                  <th>英式发音</th>
                  <th>美式发音</th>
                </tr>
              </thead>
              <tbody>
                {filteredWords.map((word) => (
                  <tr key={word.id} className="word-row">
                    <td className="word-col-english">
                      <div className="word-text">{word.english}</div>
                    </td>
                    <td className="word-col-phonetics">
                      <div className="phonetics-container">
                        {word.phonetics.us && (
                          <div className="phonetic-line">
                            <span className="phonetic-label">美</span>
                            <span className="phonetic-text">{word.phonetics.us}</span>
                          </div>
                        )}
                        {word.phonetics.uk && (
                          <div className="phonetic-line">
                            <span className="phonetic-label">英</span>
                            <span className="phonetic-text">{word.phonetics.uk}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="word-col-chinese">{word.chinese}</td>
                    <td className="word-col-pos">{word.partOfSpeech || '-'}</td>
                    <td className="word-col-pronunciation">
                      <button
                        className={`btn-pronunciation ${playingAudio === `audio-uk-${word.id}` ? 'playing' : ''}`}
                        onClick={() => playAudio(word.audioUrls.uk, `uk-${word.id}`)}
                        title="点击播放英式发音"
                      >
                        🔊 英
                      </button>
                    </td>
                    <td className="word-col-pronunciation">
                      <button
                        className={`btn-pronunciation ${playingAudio === `audio-us-${word.id}` ? 'playing' : ''}`}
                        onClick={() => playAudio(word.audioUrls.us, `us-${word.id}`)}
                        title="点击播放美式发音"
                      >
                        🔊 美
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <button className="btn-back" onClick={onBack}>
          ← 返回
        </button>
      </div>
    </div>
  );
}
