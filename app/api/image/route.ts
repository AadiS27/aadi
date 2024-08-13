import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Together from 'together-ai';

const together = new Together({
  apiKey: process.env['TOGETHER_API_KEY'],
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env['TOGETHER_API_KEY']) {
      return NextResponse.json({ error: 'TOGETHER_API_KEY not found' }, { status: 500 });
    }

    const body = await req.json();
    const { prompt, amount = 1, resolution = '512x512' } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    if (!amount || isNaN(parseInt(amount, 10))) {
      return NextResponse.json({ error: 'Invalid amount provided' }, { status: 400 });
    }

    const [width, height] = resolution.split('x').map(Number);
    if (!width || !height) {
      return NextResponse.json({ error: 'Invalid resolution provided' }, { status: 400 });
    }

    const response = await together.images.create({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      prompt,
      n: parseInt(amount, 10),
      width,
      height,
      steps: 40,
      seed: 9195,
    });

    return NextResponse.json({ images: response.data.map(img => img.b64_json) });
  } catch (error: any) {
    console.error("[CONVERSATION ERROR]", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
