import type { Request, Response } from 'express';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = process.env.GROQ_MODEL || 'llama-3.1-70b-versatile';
const FALLBACK_MODEL = process.env.GROQ_MODEL_FALLBACK || 'llama-3.1-8b-instant';

type GeneratedQuestion = {
  id?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const buildPrompt = (track: string, topic: string, n: number) => {
  return `You are an expert interviewer creating multiple-choice questions.
Topic: ${topic} (Track: ${track}).
Constraints:
- Generate ${n} interview-style MCQs.
- Each question must be job-relevant, practical, and crisp.
- Each item: question (1-2 sentences), exactly 4 distinct options, exactly 1 correct option.
- Provide a short, technical explanation for the correct answer.
- Vary wording to avoid repetition.
Return ONLY valid minified JSON matching this TypeScript type:
{"questions":[{"question":"...","options":["...","...","...","..."],"correctIndex":0,"explanation":"..."}...]}
`;
};

function stripCodeFences(text: string) {
  return text.replace(/```json[\s\S]*?\n([\s\S]*?)```/i, '$1').replace(/```[\s\S]*?\n([\s\S]*?)```/g, '$1');
}

function coerceIndexFromLetter(letter: string): number | undefined {
  const L = letter.trim().toUpperCase();
  const map: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
  return L in map ? map[L] : undefined;
}

function safeParseQuestions(content: string): any[] | null {
  try {
    const cleaned = stripCodeFences(content).trim();
    // Try object with questions
    const objMatch = cleaned.match(/\{[\s\S]*\}/);
    if (objMatch) {
      const parsed = JSON.parse(objMatch[0]);
      if (parsed && Array.isArray(parsed.questions)) return parsed.questions;
      // Common alternates
      if (Array.isArray(parsed.items)) return parsed.items;
      if (Array.isArray(parsed.data)) return parsed.data;
      if (Array.isArray(parsed.quiz)) return parsed.quiz;
    }
    // Try array form
    const arrMatch = cleaned.match(/\[[\s\S]*\]/);
    if (arrMatch) {
      const parsedArr = JSON.parse(arrMatch[0]);
      if (Array.isArray(parsedArr)) return parsedArr;
    }
    return null;
  } catch {
    return null;
  }
}

function normalizeQuestions(qs: any[]): GeneratedQuestion[] {
  const out: GeneratedQuestion[] = [];
  for (const q of qs) {
    if (!q) continue;
    const question = typeof q.question === 'string' ? q.question : (typeof q.text === 'string' ? q.text : undefined);
    let options: string[] | undefined = Array.isArray(q.options) ? q.options : (Array.isArray(q.choices) ? q.choices : undefined);
    if (!question || !options) continue;
    // Ensure strings and trim
    options = options.map((o: any) => String(o)).filter(Boolean);
    if (options.length < 4) continue;
    if (options.length > 4) options = options.slice(0, 4);

    let correctIndex: number | undefined = typeof q.correctIndex === 'number' ? q.correctIndex : undefined;
    if (correctIndex === undefined && typeof q.correct === 'number') correctIndex = q.correct;
    if (correctIndex === undefined && typeof q.answerIndex === 'number') correctIndex = q.answerIndex;
    if (correctIndex === undefined && typeof q.answer === 'string') {
      // Could be letter (A-D) or exact option text
      const byLetter = coerceIndexFromLetter(q.answer);
      if (byLetter !== undefined) correctIndex = byLetter;
      else {
        const idx = options.findIndex(opt => opt.toLowerCase().trim() === q.answer.toLowerCase().trim());
        if (idx >= 0) correctIndex = idx;
      }
    }
    if (correctIndex === undefined && typeof q.correct_option === 'string') {
      const byLetter = coerceIndexFromLetter(q.correct_option);
      if (byLetter !== undefined) correctIndex = byLetter;
    }
    if (correctIndex === undefined) continue;
    if (correctIndex < 0 || correctIndex > 3) continue;

    const explanation = typeof q.explanation === 'string' ? q.explanation : (typeof q.reason === 'string' ? q.reason : '');
    out.push({ question, options, correctIndex, explanation });
  }
  return out;
}

function validateQuestions(qs: GeneratedQuestion[], expected: number) {
  if (!Array.isArray(qs) || qs.length < Math.min(4, expected)) return false;
  for (const q of qs) {
    if (
      !q || typeof q.question !== 'string' ||
      !Array.isArray(q.options) || q.options.length !== 4 ||
      typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > 3 ||
      typeof q.explanation !== 'string'
    ) {
      return false;
    }
  }
  return true;
}

export const generateAIQuiz = async (req: Request, res: Response) => {
  try {
    const { track, topic, n } = req.body || {};
    const count = Math.max(4, Math.min(parseInt(n, 10) || 15, 30));
    if (!track || !topic) {
      return res.status(400).json({ error: 'track and topic are required' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY not configured on server. Add GROQ_API_KEY to server/.env and restart.' });
    }

    if (typeof fetch !== 'function') {
      return res.status(500).json({ error: 'Global fetch is not available. Run server on Node.js 18+ or add a fetch polyfill.' });
    }

    const prompt = buildPrompt(track, topic, count);

    let usedModel = DEFAULT_MODEL;
    let response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: usedModel,
        messages: [
          { role: 'system', content: 'You generate JSON only. No prose. Strictly follow the schema.' },
          { role: 'user', content: prompt }
        ],
    temperature: 0.7,
    max_tokens: 3000,
    response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      const needsFallback = /model_decommissioned|model_not_found/i.test(errText);
      if (needsFallback && FALLBACK_MODEL && FALLBACK_MODEL !== usedModel) {
        usedModel = FALLBACK_MODEL;
        response = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: usedModel,
            messages: [
              { role: 'system', content: 'You generate JSON only. No prose. Strictly follow the schema.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 3000,
            response_format: { type: 'json_object' }
          })
        });
      }
      if (!response.ok) {
        const again = await response.text();
        return res.status(502).json({ error: 'LLM call failed', details: again });
      }
    }

    const data = await response.json();
    const content: string = data?.choices?.[0]?.message?.content || '';
    const raw = safeParseQuestions(content);
    const normalized = raw ? normalizeQuestions(raw) : null;
    if (!normalized || !validateQuestions(normalized, count)) {
      return res.status(502).json({ error: 'Invalid questions format from model' });
    }

    // Ensure we return exactly count items if available
    const sliced = normalized.slice(0, count).map((q, idx) => ({
      id: `${Date.now()}-${idx}`,
      ...q,
    }));

    return res.json({
      setId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      track,
      topic,
      questions: sliced
    });
  } catch (error: any) {
    console.error('AI quiz generation failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default { generateAIQuiz };
