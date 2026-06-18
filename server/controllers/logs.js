const { GoogleGenAI } = require('@google/genai');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
const { z } = require('zod');

// Zod schemas for input validation
const LogEntrySchema = z.object({
  category: z.enum(['transport', 'diet', 'energy', 'shopping']),
  co2Impact: z.number().nonnegative(),
  description: z.string().max(500).optional(),
  metadata: z.record(z.any()).optional(),
  textInput: z.string().optional(),
});

async function processGamification(userId, logData) {
    try {
        const user = await User.findById(userId);
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

/**
 * @desc    Add a log entry
 * @route   POST /api/logs
 * @access  Private
 */
const addLog = async (req, res) => {
  try {
    const { textInput } = req.body;
    const userId = req.user.id;

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
        
        // Validate AI output against our schema
        const validatedData = LogEntrySchema.parse({ ...parsed, textInput });

        const log = new ActivityLog({
            userId,
            ...validatedData
        });
        await log.save();
        await processGamification(userId, validatedData);
        return res.status(201).json(log);
    } else {
        // Validate explicit data
        const validatedData = LogEntrySchema.parse(req.body);
        
        const log = new ActivityLog({ ...validatedData, userId });
        await log.save();
        await processGamification(userId, validatedData);
        res.status(201).json(log);
    }
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Get logs for user
 * @route   GET /api/logs
 * @access  Private
 */
const getLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addLog,
  getLogs
};
