import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!openai.apiKey) {
      return NextResponse.json({ error: 'OpenAI key not found' }, { status: 500 });
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages
    });

    return NextResponse.json(response.choices[0].message);
  } catch (error: any) {
    console.log("[CONVERSATION ERROR]", error);

    // Handle rate limit error (429)
    if (error.status === 429) {
      return NextResponse.json({ error: 'Rate limit exceeded, please try again later.' }, { status: 429 });
    }

    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
