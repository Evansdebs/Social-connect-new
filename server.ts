import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fix #19: Simple in-memory rate limiter for AI endpoints (10 req/min per IP)
const aiRateLimitMap = new Map<string, { count: number; resetAt: number }>();
const AI_RATE_LIMIT = 10;
const AI_RATE_WINDOW_MS = 60_000;

function aiRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = aiRateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    aiRateLimitMap.set(ip, { count: 1, resetAt: now + AI_RATE_WINDOW_MS });
    return next();
  }

  if (record.count >= AI_RATE_LIMIT) {
    return res.status(429).json({
      error: 'Too many AI requests. Please wait a moment before trying again.',
      retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000)
    });
  }

  record.count++;
  return next();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use('/api/ai', aiRateLimiter);

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

  // AI Study Buddy Assistant
  app.post('/api/ai/studybuddy', async (req, res) => {
    const { messages = [], subject = 'general' } = req.body;
    const ai = getGeminiClient();

    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === 'user')?.content || 'Help me study';

    if (!ai) {
      // Academic tutor knowledge engine fallback for offline / unkeyed environments
      const queryLower = lastUserMsg.toLowerCase();
      let responseText = '';

      if (queryLower.includes('pythagor') || queryLower.includes('theorem')) {
        responseText = `📐 **The Pythagorean Theorem**\n\nIn any right-angled triangle, the square of the hypotenuse ($c$) is equal to the sum of the squares of the other two sides ($a$ and $b$):\n\n$$\\mathbf{a^2 + b^2 = c^2}$$\n\n**Example:**\nIf $a = 3\\text{ cm}$ and $b = 4\\text{ cm}$:\n$$c^2 = 3^2 + 4^2 = 9 + 16 = 25$$\n$$c = \\sqrt{25} = 5\\text{ cm}$$\n\n**Common Pythagorean Triples to remember for exams:**\n• (3, 4, 5)\n• (5, 12, 13)\n• (8, 15, 17)\n• (7, 24, 25)\n\nKeep practicing! Would you like a practice question on this?`;
      } else if (queryLower.includes('photosynthesis')) {
        responseText = `🔬 **Photosynthesis Summary & Quiz Questions**\n\n**Equation:**\n$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{light} \\rightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$\n\n**Practice Quiz Questions:**\n1. What green pigment in the chloroplast absorbs light energy?\n2. In which organelle does photosynthesis take place?\n3. What are the two main stages of photosynthesis? *(Hint: Light-dependent & Light-independent/Calvin cycle)*\n4. What gas is released as a byproduct into the atmosphere?\n5. Why do plants appear green to the human eye? *(Hint: Chlorophyll reflects green wavelengths)*\n\nTry answering these in our chat and I will grade them for you!`;
      } else if (queryLower.includes('newton') || queryLower.includes('law of motion')) {
        responseText = `🚀 **Newton's Three Laws of Motion**\n\n1. **First Law (Inertia):** An object at rest stays at rest, and an object in motion stays in motion at a constant speed and in a straight line, unless acted upon by an external unbalanced force.\n\n2. **Second Law ($F = ma$):** The rate of change of momentum is directly proportional to the applied force. Acceleration is directly proportional to net force and inversely proportional to mass.\n\n3. **Third Law (Action & Reaction):** For every action, there is an equal and opposite reaction.\n\n**Exam Tip:** Be prepared to calculate force using $F = m \\times a$ with units in Newtons (N = kg·m/s²).`;
      } else if (queryLower.includes('things fall apart') || queryLower.includes('achebe') || queryLower.includes('okonkwo')) {
        responseText = `📚 **Chinua Achebe's 'Things Fall Apart' — Key Themes**\n\n1. **Clash of Cultures & Colonialism:** The disruption of traditional Igbo society by the arrival of British colonial administrators and Christian missionaries.\n2. **Fate vs. Individual Will (Chi):** Okonkwo's constant struggle to overcome what he perceives as his father Unoka's weakness and bad chi.\n3. **Masculinity & Fear of Weakness:** Okonkwo's tragic flaw (*hamartia*) is his overwhelming dread of being seen as soft, which drives him to rash actions.\n4. **Change vs. Tradition:** How communities adapt or fracture when confronted with external institutional change.\n\nWould you like an essay outline on any specific character?`;
      } else if (queryLower.includes('simultaneous') || queryLower.includes('equation')) {
        responseText = `✏️ **Solving Simultaneous Equations: Step-by-Step**\n\nLet's solve by **Elimination**:\n$$\\text{Eq 1: } 2x + y = 7$$\n$$\\text{Eq 2: } x - y = 2$$\n\n**Step 1: Add the two equations** to eliminate $y$:\n$$(2x + x) + (y - y) = 7 + 2$$\n$$3x = 9 \\implies x = 3$$\n\n**Step 2: Substitute $x = 3$ back into Equation 2**:\n$$3 - y = 2 \\implies y = 1$$\n\n**Solution:** $(x, y) = (3, 1)$\n\n**Check:** In Eq 1: $2(3) + 1 = 7$ ✓ Perfect!`;
      } else {
        responseText = `💡 **Campus Study Buddy Guide for ${subject.toUpperCase()}**\n\nGreat question regarding **"${lastUserMsg}"**!\n\nHere is a structured breakdown to master this topic:\n\n1. **Core Concept:** Break the problem down into its fundamental definition before attempting complex calculations or arguments.\n2. **Step-by-Step Approach:** Identify what is given (*knowns*), what is required (*unknowns*), and the governing formulas or rules.\n3. **Active Practice:** The best way to retain this for midterms and exams is to solve 2-3 similar problems without looking at solutions.\n4. **Feynman Review:** Can you explain this concept in one sentence to a junior student?\n\nAsk me any follow-up question or paste an exact exam question, and we will work through it together!`;
      }

      return res.json({ text: responseText, isFallback: true });
    }

    try {
      const systemInstruction = `You are an encouraging, highly knowledgeable AI Study Buddy for secondary school and university students on Campus Connect in West Africa. You specialize in ${subject}.
Your tone is friendly, inspiring, clear, and structured. Use step-by-step formatting with bullet points and bold key terms. Provide relatable examples and celebrate the student's progress.`;

      const formattedContents = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: formattedContents.length > 0 ? formattedContents : [{ role: 'user', parts: [{ text: lastUserMsg }] }],
        config: {
          systemInstruction,
          maxOutputTokens: 1024,
          temperature: 0.7
        }
      });

      const responseText = response.text?.trim() || 'Here is your study guide!';
      res.json({ text: responseText, isFallback: false });
    } catch (err: any) {
      console.error('Gemini StudyBuddy error:', err);
      res.json({
        text: `💡 **Study Tip for ${subject}:**\n\nFocus on mastering the core principles of **${lastUserMsg}**. Create short summary flashcards, test yourself using past questions, and review with your study group on Campus Connect!`,
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
