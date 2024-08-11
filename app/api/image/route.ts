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
    const { prompt,amount=1,resolution='512x512' } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }
    if (!amount) {
      return NextResponse.json({ error: 'No amount provided' }, { status: 400 });
    }
    if (!resolution) {
      return NextResponse.json({ error: 'No resolution provided' }, { status: 400 });
    }

    // const response = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages
    // });

    const response = await together.images.create({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      prompt,
      n:parseInt(amount,10),
      width:512,
      height:512,
      steps: 40,
      seed: 9195

    });

    return NextResponse.json(response.data[0].b64_json);
  } catch (error: any) {
    console.log("[CONVERSATION ERROR]", error);

    return NextResponse.json({ error }, { status: 500 });
  }
}