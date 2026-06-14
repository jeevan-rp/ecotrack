const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog');
const { GoogleGenAI } = require('@google/genai');

const User = require('../models/User');

async function processGamification(userId, logData) {
    try {
        const user = await User.findOne({ authProviderId: userId });
        if (!user) return;

        const now = new Date();
        if (user.lastLogDate) {
            const diffTime = Math.abs(now - user.lastLogDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            if (diffDays === 1) {
                user.currentStreak += 1;
            } else if (diffDays > 1) {
                user.currentStreak = 1;
            }
        } else {
            user.currentStreak = 1;
        }
        user.lastLogDate = now;

        // Badges logic
        if (logData.category === 'transport' && logData.co2Impact < 2 && !user.badges.includes('Transit Hero')) {
            user.badges.push('Transit Hero');
        }
        const desc = (logData.description || '').toLowerCase();
        if (logData.category === 'diet' && (desc.includes('vegan') || desc.includes('plant')) && !user.badges.includes('Plant Power')) {
             user.badges.push('Plant Power');
        }
        if (user.currentStreak >= 7 && !user.badges.includes('7 Day Streak')) {
             user.badges.push('7 Day Streak');
        }

        await user.save();
    } catch (err) {
        console.error("Gamification error:", err);
    }
}

// Add a log
router.post('/', async (req, res) => {
  try {
    const { userId, textInput } = req.body;

    if (textInput) {
        // Natural language parsing with Gemini
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `Parse this carbon footprint activity: "${textInput}". Return a JSON object with: category ('transport', 'diet', 'energy', 'shopping'), co2Impact (number in kg), description (short string), and metadata (any relevant object, e.g. {distance, fuel} or {mealType}). Just return raw JSON.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        
        let aiResult = response.text;
        aiResult = aiResult.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(aiResult);
        
        const log = new ActivityLog({
            userId,
            ...parsed
        });
        await log.save();
        await processGamification(userId, parsed);
        return res.status(201).json(log);
    } else {
        const log = new ActivityLog(req.body);
        await log.save();
        await processGamification(req.body.userId, req.body);
        res.status(201).json(log);
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// Get logs for user
router.get('/:userId', async (req, res) => {
  try {
    const logs = await ActivityLog.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
