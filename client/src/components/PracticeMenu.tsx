import { useState } from 'react';
import { Word } from '../types';
import './PracticeMenu.css';

interface PracticeMenuProps {
  words: Word[];
  onSelectWord: (word: Word) => void;
  onStartPractice: (type: string) => void;
  onBack: () => void;
}

export default function PracticeMenu({
  words,
  onSelectWord,
  onStartPractice,
  onBack,
}: PracticeMenuProps) {
  const [showWordList, setShowWordList] = useState(false);

  const practiceTypes = [
    {
      id: 'word-list',
      name: '词汇表',
      icon: '📖',
      description: '查看所有单词的详细信息',
    },
    {
      id: 'listening',
      name: '听力选词',
      icon: '🎧',
      description: '听发音，选择正确单词',
    },
    {
      id: 'fill-in',
      name: '单词补全',
      icon: '✏️',
      description: '填补缺失的字母完成单词',
    },
    {
      id: 'sort-letters',
      name: '字母排序',
      icon: '🔤',
      description: '用乱序字母排列成正确单词',
    },
    {
      id: 'spelling',
      name: '听音拼写',
      icon: '📝',
      description: '听发音后输入正确单词',
    },
    {
      id: 'image-fill',
      name: '看图填词',
      icon: '🖼️',
      description: '根据图片和中文填写英文单词',
    },
    {
      id: 'pronunciation-test',
      name: '发音检测',
      icon: '🎤',
      description: '说出单词，获得发音准确度反馈',
    },
  ];

  return (
    <div className="practice-menu-container">
      <div className="practice-menu-header">
        <h2>练习菜单</h2>
        <p>已加载单词数：<strong>{words.length}</strong>个</p>
      </div>

      <div className="practice-grid">
        {practiceTypes.map((practice) => (
          <div
            key={practice.id}
            className="practice-card"
            onClick={() => onStartPractice(practice.id)}
          >
            <div className="practice-icon">{practice.icon}</div>
            <h3>{practice.name}</h3>
            <p>{practice.description}</p>
          </div>
        ))}
      </div>

      <div className="divider">或</div>

      <div className="word-section">
        <button
          className="btn-toggle-list"
          onClick={() => setShowWordList(!showWordList)}
        >
          {showWordList ? '➖' : '➕'} {words.length}个已加载单词
        </button>

        {showWordList && (
          <div className="word-list">
            {words.map((word) => (
              <div
                key={word.id}
                className="word-item"
                onClick={() => onSelectWord(word)}
              >
                <span className="word-english">{word.english}</span>
                <span className="word-chinese">{word.chinese}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="btn-back-menu" onClick={onBack}>
        ← 返回并重新导入单词
      </button>
    </div>
  );
}
