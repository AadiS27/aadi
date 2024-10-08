import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Together from 'together-ai';
import{incrementApiCount,checkApiLimit} from'@/lib/api-limit';

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
    const { prompt, amount, resolution = '512x512' } = body;

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
    const isWithinLimit = await checkApiLimit();

    if (!isWithinLimit) {
      return new NextResponse('Free trial ended' , { status: 403 });
    }

    const response = await together.images.create({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      prompt,
      n:parseInt(amount),
      width,
      height,
      steps: 40,
      seed: 9195,
    });
    await incrementApiCount();
    return NextResponse.json("data:image/png;base64,"+response.data[0].b64_json);
  } catch (error: any) {
    console.error("[CONVERSATION ERROR]", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}