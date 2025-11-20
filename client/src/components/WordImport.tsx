import { useState } from 'react';
import axios from 'axios';
import { Word } from '../types';
import './WordImport.css';

interface WordImportProps {
  onWordsImported: (words: Word[]) => void;
}

export default function WordImport({ onWordsImported }: WordImportProps) {
  const [inputText, setInputText] = useState(`apple	苹果
banana	香蕉
invite	邀请
birthday	生日
bring	带来
phone	手机`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const parseWords = (text: string): Array<{ english: string; chinese: string }> => {
    const lines = text.trim().split('\n');
    return lines
      .map((line) => {
        const parts = line.split(/[\t,]/);
        if (parts.length >= 2) {
          return {
            english: parts[0].trim(),
            chinese: parts[1].trim(),
          };
        }
        return null;
      })
      .filter((item) => item !== null) as Array<{ english: string; chinese: string }>;
  };

  const fetchWordData = async (word: { english: string; chinese: string }): Promise<Word> => {
    try {
      // Fetch dictionary data
      const dictResponse = await axios.get(`/api/dict/${word.english.toLowerCase()}`);
      const dictData = dictResponse.data;

      // Fetch image
      let imageUrl = '';
      try {
        const imageResponse = await axios.get(`/api/image/${word.english.toLowerCase()}`, {
          params: { chinese: word.chinese },
        });
        imageUrl = imageResponse.data.imageUrl;
      } catch {
        console.warn(`Could not fetch image for ${word.english}`);
      }

      return {
        id: `${Date.now()}-${Math.random()}`,
        english: word.english,
        chinese: word.chinese,
        phonetics: dictData.phonetics || { us: '', uk: '' },
        partOfSpeech: dictData.partOfSpeech || '',
        audioUrls: dictData.audioUrls || { us: null, uk: null },
        imageUrl,
        mnemonic: '', // User can add this later
      };
    } catch (error) {
      console.error(`Error fetching data for ${word.english}:`, error);
      // Return a word object even if data fetch fails
      return {
        id: `${Date.now()}-${Math.random()}`,
        english: word.english,
        chinese: word.chinese,
        phonetics: { us: '', uk: '' },
        partOfSpeech: '',
        audioUrls: { us: null, uk: null },
        imageUrl: '',
        mnemonic: '',
      };
    }
  };

  const handleImport = async () => {
    if (!inputText.trim()) {
      setError('Please enter some words');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const parsedWords = parseWords(inputText);

      if (parsedWords.length === 0) {
        setError('Invalid format. Please use format: word\\tchineseword or word,chineseword');
        setLoading(false);
        return;
      }

      // Fetch data for each word
      const importedWords = await Promise.all(parsedWords.map((w) => fetchWordData(w)));

      onWordsImported(importedWords);
    } catch (err) {
      setError('Error importing words. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="word-import-container">
      <div className="word-import-card">
        <h2>📝 导入单词</h2>
        <p className="help-text">
          输入格式：<code>English Word [tab] 中文意思</code>
          <br />
          或使用逗号：<code>English Word, 中文意思</code>
        </p>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="输入单词列表..."
          rows={12}
          className="word-input"
          disabled={loading}
        />

        {error && <div className="error-message">{error}</div>}

        <button
          onClick={handleImport}
          disabled={loading}
          className="btn-import"
        >
          {loading ? '⏳ 导入中...' : '📚 导入单词'}
        </button>

        <div className="tips">
          <h3>💡 提示：</h3>
          <ul>
            <li>每行一个单词</li>
            <li>使用Tab键或逗号分隔英文和中文</li>
            <li>系统将自动获取发音和图片</li>
            <li>确保您有互联网连接以获取数据</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
