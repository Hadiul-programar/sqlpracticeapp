import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Download entire codebase as ZIP
  app.get('/api/download-zip', (req, res) => {
    try {
      const zipPath = '/tmp/sql_studio_source.zip';
      const pyCmd = `python3 -c "import os, zipfile; z = zipfile.ZipFile('${zipPath}', 'w', zipfile.ZIP_DEFLATED); [z.write(os.path.join(r, f), os.path.relpath(os.path.join(r, f), '.')) for r, d, fs in os.walk('.') if not any(x in r for x in ['node_modules', 'dist', '.git', '.cache']) for f in fs if not f.endswith('.zip')]"`;
      execSync(pyCmd);
      res.download(zipPath, 'sql-practice-studio-source.zip');
    } catch (err: any) {
      console.error('ZIP Generation Error:', err);
      res.status(500).json({ error: 'ZIP ফাইল তৈরিতে সমস্যা হয়েছে: ' + (err.message || '') });
    }
  });

  // AI Tutor Route using Gemini API
  app.post('/api/ai-explain', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: 'Gemini API Key সেট করা নেই। Secrets সেটিংসে GEMINI_API_KEY যুক্ত করুন।',
        });
      }

      const { query, error, question, context } = req.body;

      const ai = new GoogleGenAI({ apiKey });

      let prompt = '';
      if (error) {
        prompt = `আপনি একজন বন্ধুভাবাপন্ন বাংলা এসকিউএল (SQL) টিউটর।
শিক্ষার্থী একটি SQL কোয়েরি চালানোর চেষ্টা করেছে এবং একটি ত্রুটি (Error) ঘটেছে।

প্রশ্ন: ${question || 'সাধারণ SQL অনুশীলন'}
শিক্ষার্থীর লেখা SQL: ${query}
SQL Engine Error: ${error}

অনুগ্রহ করে অত্যন্ত সহজ বাংলায় ২-৩ টি বাক্যে নিচের বিষয়গুলো বুঝিয়ে বলুন:
১. ভুলটি কোথায় হয়েছে এবং কেন হয়েছে?
২. কীভাবে এটি সহজে ঠিক করা যাবে? (সরাসরি সঠিক কোড দেওয়ার আগে সংকেত দিন)।
সহজ ও সাবলীল বাংলায় উত্তর দিন।`;
      } else if (context === 'explain_query') {
        prompt = `আপনি একজন বন্ধুভাবাপন্ন বাংলা এসকিউএল (SQL) টিউটর।
শিক্ষার্থী নিচের SQL কোয়েরিটি বুঝতে চাচ্ছে:

কোয়েরি: ${query}
প্রশ্ন বা প্রসঙ্গ: ${question || 'সাধারণ ব্যাখ্যা'}

অনুগ্রহ করে সহজ বাংলায় প্রতিটি কীওয়ার্ড (যেমন SELECT, FROM, WHERE, GROUP BY, JOIN ইত্যাদি) এবং এই কোয়েরিটি কীভাবে কাজ করে তা ৩-৪ টি বাক্যে বুঝিয়ে বলুন।`;
      } else {
        prompt = `আপনি একজন বাংলা এসকিউএল টিউটর। শিক্ষার্থীর SQL প্রশ্নটি হলো: "${question}". তার কোয়েরি: "${query}". বিষয়টির একটি দরকারী সংকেত বা ব্যাখ্যা সহজ বাংলায় দিন।`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const explanation = response.text || 'কোনো ব্যাখ্যা পাওয়া যায়নি।';
      return res.json({ explanation });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      return res.status(500).json({
        error: 'এআই টিউটরের সাথে যোগাযোগে সমস্যা হয়েছে: ' + (err.message || 'Unknown error'),
      });
    }
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
