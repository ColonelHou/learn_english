import { useEffect, useState } from 'react';
import axios from 'axios';
import { Word } from '../types';
import './StudyHistory.css';

interface StudyDate {
  date: string;
  displayDate: string;
  wordCount: number;
  path: string;
}

interface StudyHistoryProps {
  onWordsLoaded: (words: Word[]) => void;
  onBack: () => void;
}

function StudyHistory({ onWordsLoaded, onBack }: StudyHistoryProps) {
  const [dates, setDates] = useState<StudyDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loadingWords, setLoadingWords] = useState(false);

  useEffect(() => {
    fetchStudyDates();
  }, []);

  const fetchStudyDates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/study-history/list');
      setDates(response.data.dates || []);
    } catch (err) {
      console.error('Error fetching study dates:', err);
      setError('无法加载学习历史。请检查连接。');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDate = async (date: StudyDate) => {
    try {
      setLoadingWords(true);
      setSelectedDate(date.date);
      const [year, month, day] = date.path.split('/');
      const response = await axios.get(
        `/api/study-history/${year}/${month}/${day}`
      );

      if (response.data.success && response.data.words) {
        onWordsLoaded(response.data.words);
      }
    } catch (err) {
      console.error('Error loading study data:', err);
      setError('无法加载该日期的学习数据。');
    } finally {
      setLoadingWords(false);
    }
  };

  return (
    <div className="study-history-container">
      <div className="study-history-card">
        <div className="study-history-header">
          <h2>📅 学习历史</h2>
          <p>选择要复习的日期</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">加载中...</div>
        ) : dates.length === 0 ? (
          <div className="no-history">
            <p>暂无学习历史记录</p>
            <p>导入单词并开始学习，系统会自动保存您的学习进度。</p>
          </div>
        ) : (
          <div className="dates-grid">
            {dates.map((date) => (
              <button
                key={date.date}
                className={`date-card ${selectedDate === date.date ? 'selected' : ''}`}
                onClick={() => handleLoadDate(date)}
                disabled={loadingWords && selectedDate === date.date}
              >
                <div className="date-display">{date.displayDate}</div>
                <div className="word-count">
                  {loadingWords && selectedDate === date.date ? (
                    <span className="loading-spinner">加载中...</span>
                  ) : (
                    <span>{date.wordCount} 个单词</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="study-history-footer">
          <button className="btn-back-history" onClick={onBack}>
            ← 返回
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudyHistory;
