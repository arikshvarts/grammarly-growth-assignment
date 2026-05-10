import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const getSystemPrompt = (strength?: string): string => {
  const base = `You are an expert human editor. Your goal is to make the text sound natural and credible while preserving all original ideas.

Preserve all domain terms, product names, proper nouns, metrics, and technical language exactly. Match the domain register of the original. Preserve every idea. Do not add or remove meaning. 

CRITICAL RULE: Never use em dashes in your output. Use commas, colons, or standard hyphens (-) instead.

Return only the rewritten text with no preamble, no label, no quotes.

Remove these robotic patterns:
- "In today's world", "In an era of", "It is important to note", "Furthermore", "Moreover", "Additionally", "In addition"
- "In the realm of", "When it comes to", "With regard to", "In terms of", "Moving forward"
- "It can be argued", "One could say", "It may be said", "It is possible that"
- Over-use of passive voice where active is natural
- Repeating sentence openers back-to-back

What natural writing sounds like: varied sentence lengths, words people actually use, specific rather than vague, contractions where they fit (I'm, it's, we'll), active voice, gets to the point fast.`;

  if (strength === 'strong') {
    return base + `\n\nRewrite mode: STRONG. Significantly improve clarity, rhythm, and flow. Feel free to restructure sentences and rephrase ideas while keeping all original meaning. Aim for 20-40% word change if needed.`;
  }
  if (strength === 'balanced') {
    return base + `\n\nRewrite mode: BALANCED. Improve clarity and flow while keeping the core structure. Change 10-20% of words where it improves readability. Balance improvement with preserving the original voice.`;
  }
  // light mode (default)
  return base + `\n\nRewrite mode: LIGHT. Fix awkward phrasing and robotic connectors but keep the structure mostly the same. Change only 4-10 words ideally. Preserve the original voice.`;
};

export async function POST(req: Request) {
  try {
    const { text, answers } = await req.json();
    if (!text) return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: 'API key not set' }, { status: 500 });

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const useCaseMap: Record<string, string> = {
      work: 'professional business writing: clear, credible, concise',
      essay: 'academic writing: precise and well-structured without sounding stiff',
      marketing: 'marketing copy: engaging, direct, and memorable',
      general: 'everyday communication: warm and easy to read',
    };
    const toneMap: Record<string, string> = {
      natural: 'natural and conversational, as if speaking to a trusted colleague',
      professional: 'clear and professional, confident without being cold',
      conversational: 'warm and approachable, friendly without losing credibility',
      confident: 'confident and direct, gets to the point without hedging',
    };
    const strengthMap: Record<string, string> = {
      light: 'light polish: fix awkward phrasing and robotic connectors but keep the structure',
      balanced: 'balanced rewrite: improve clarity and flow while preserving core ideas',
      strong: 'stronger rewrite: significantly improve clarity and rhythm while keeping all original ideas',
    };

    let prompt = `Rewrite the following text so it sounds naturally human.\n\nText:\n${text}`;
    if (answers && Object.keys(answers).length > 0) {
      const parts: string[] = [];
      if (answers.useCase && useCaseMap[answers.useCase]) parts.push(`Use case: ${useCaseMap[answers.useCase]}`);
      if (answers.tone && toneMap[answers.tone]) parts.push(`Tone: ${toneMap[answers.tone]}`);
      if (answers.strength && strengthMap[answers.strength]) parts.push(`Rewrite depth: ${strengthMap[answers.strength]}`);
      if (parts.length > 0) prompt += `\n\nPersonalization:\n${parts.join('\n')}`;
    }

    const systemPrompt = getSystemPrompt(answers?.strength);
    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      temperature: 0.72,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    });

    const firstBlock = msg.content[0];
    const rewrite = typeof firstBlock === 'object' && firstBlock && 'text' in firstBlock
      ? String(firstBlock.text).trim() : '';

    if (!rewrite) return NextResponse.json({ error: 'Empty rewrite' }, { status: 500 });
    return NextResponse.json({ rewrite });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Rewrite failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  if (process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ status: 'ok' });
  }
  return NextResponse.json({ status: 'missing' }, { status: 404 });
}
