import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;
    

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    if (!prompt) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    const response = await replicate.run("riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05", 
      { 
        input : {
          prompt_b: prompt
      }
       });
    return NextResponse.json(response);
  } catch (error: any) {
    console.log("[MUSIC ERROR]", error);

    return NextResponse.json({ error }, { status:500});
}
}