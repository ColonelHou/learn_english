import express from 'express';
import { generateMnemonicSuggestions } from '../utils/mnemonic-generator.js';

const router = express.Router();

// 获取单词的助记建议
router.get('/:word/:chinese', (req, res) => {
  try {
    const { word, chinese } = req.params;

    if (!word || !chinese) {
      return res.status(400).json({ error: 'Word and Chinese meaning are required' });
    }

    // 解码URL编码的中文
    const decodedChinese = decodeURIComponent(chinese);

    // 生成助记建议
    const suggestions = generateMnemonicSuggestions(word, decodedChinese);

    res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error('Error generating mnemonic suggestions:', error);
    res.status(500).json({ error: 'Failed to generate mnemonic suggestions' });
  }
});

export default router;
