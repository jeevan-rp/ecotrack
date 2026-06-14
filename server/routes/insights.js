const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog');
const Insight = require('../models/Insight');
const { GoogleGenAI } = require('@google/genai');

router.post('/generate/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const logs = await ActivityLog.find({ userId }).sort({ date: -1 }).limit(10);
    
    if (!logs.length) return res.status(400).json({ message: 'No logs to analyze' });

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `Based on these recent carbon footprint logs: ${JSON.stringify(logs)}, provide a JSON analysis with 3 keys: 'trendSummary' (1 sentence), 'geminiAnalogy' (a fun/creative analogy equating the emissions/savings to something relatable), and 'actionableTip' (1 sentence tip). Just return raw JSON.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    let aiResult = response.text;
    aiResult = aiResult.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(aiResult);

    const insight = new Insight({
        userId,
        ...parsed
    });
    await insight.save();

    res.status(201).json(insight);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/:userId', async (req, res) => {
    try {
        const insights = await Insight.find({ userId: req.params.userId }).sort({ generatedAt: -1 });
        res.json(insights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
