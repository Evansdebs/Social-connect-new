import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy Gemini client helper
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  };

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Campus Connect API', time: new Date().toISOString() });
  });

  // AI Caption Assistant
  app.post('/api/ai/caption', async (req, res) => {
    const { topic, mediaType = 'photo', tone = 'energetic' } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // High-quality contextual fallback if API key is not yet set
      const fallbacks = [
        `POV: Giving it everything for the campus! Big moments at the lab/field today 🔥⚡ #CampusConnect #${topic?.replace(/\s+/g, '') || 'SchoolPride'}`,
        `Milestone unlocked! Proud of our team representing excellence and hard work 🏆✨ #${topic?.replace(/\s+/g, '') || 'StudentLife'}`,
        `Nothing beats the energy when the whole school comes together to support each other! 📣🙌 #CampusSpirit #${topic?.replace(/\s+/g, '') || 'InterSchool'}`
      ];
      return res.json({
        caption: fallbacks[Math.floor(Math.random() * fallbacks.length)],
        isFallback: true
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are the creative AI Caption Assistant for Campus Connect, a high-school and college social network.
Generate a punchy, youth-friendly, creative social media caption (under 200 characters) for a ${mediaType} post about: "${topic}".
Include 2-3 relevant hashtags. Tone: ${tone}. Do not include quotes.`
      });

      const caption = response.text?.trim() || `Excited about ${topic}! 🚀 #CampusConnect`;
      res.json({ caption, isFallback: false });
    } catch (err: any) {
      console.error('Gemini caption error:', err);
      res.json({
        caption: `Amazing day working on ${topic}! Teamwork always makes the dream work 🙌✨ #CampusConnect #${topic?.replace(/\s+/g, '') || 'SchoolLife'}`,
        isFallback: true
      });
    }
  });

  // AI Hashtag Assistant
  app.post('/api/ai/hashtags', async (req, res) => {
    const { topic } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const genericTags = ['#CampusConnect', '#StudentLife', '#HighSchoolExcellence', '#InterSchoolLeague', `#${topic?.replace(/\s+/g, '') || 'CampusVibes'}`];
      return res.json({ hashtags: genericTags, isFallback: true });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate 5 viral, trending social media hashtags for high school/college students on Campus Connect for topic: "${topic}". Return only the hashtags separated by space.`
      });
      const text = response.text || '';
      const tags = text.match(/#[a-zA-Z0-9_]+/g) || ['#CampusConnect', '#StudentLife'];
      res.json({ hashtags: tags, isFallback: false });
    } catch (err) {
      res.json({
        hashtags: ['#CampusConnect', '#StudentLife', '#SchoolSpirit', '#NextGenLeaders'],
        isFallback: true
      });
    }
  });

  // AI Event Description Assistant
  app.post('/api/ai/event-description', async (req, res) => {
    const { title, category, schoolName } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        description: `Join ${schoolName || 'our school'} for the upcoming ${title}! An exciting opportunity for students across campuses to showcase talent, compete friendly, and celebrate community spirit. Refreshments and certificates provided.`,
        isFallback: true
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write an exciting 2-3 sentence invitation description for an upcoming high school event:
Event Name: "${title}"
Category: "${category}"
Host School: "${schoolName}"
Include call to action to RSVP. Keep it friendly and inspiring.`
      });
      res.json({ description: response.text?.trim(), isFallback: false });
    } catch (err) {
      res.json({
        description: `Calling all students! Be part of ${title} hosted by ${schoolName}. Connect, compete, and discover!`,
        isFallback: true
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Campus Connect server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Campus Connect server:', err);
});
