import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Together from 'together-ai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
// });

const together = new Together({
  apiKey: process.env['TOGETHER_API_KEY'],
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // if (!openai.apiKey) {
    //   return NextResponse.json({ error: 'OpenAI key not found' }, { status: 500 });
    // }

    if (!process.env['TOGETHER_API_KEY']) {
      return NextResponse.json({ error: 'OpenAI key not found' }, { status: 500 });
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    // const response = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages
    // });

    const response = await together.chat.completions.create({
      model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
      messages,
    });

    return NextResponse.json(response.choices[0].message?.content);
  } catch (error: any) {
    console.log("[CONVERSATION ERROR]", error);

    return NextResponse.json({ error }, { status: 500 });
  }
}