export interface Word {
  id: string;
  english: string;
  chinese: string;
  phonetics: {
    us: string;
    uk: string;
  };
  partOfSpeech: string;
  audioUrls: {
    us: string | null;
    uk: string | null;
  };
  imageUrl?: string;
  mnemonic?: string; // 助记词
}

export interface DictEntry {
  word: string;
  phonetics: {
    us: string | null;
    uk: string | null;
  };
  partOfSpeech: string | null;
  audioUrls: {
    us: string | null;
    uk: string | null;
  };
}

export interface PracticeResult {
  exerciseType: string;
  word: string;
  isCorrect: boolean;
  userAnswer?: string;
  accuracy?: number; // For pronunciation test
  timestamp: number;
}
