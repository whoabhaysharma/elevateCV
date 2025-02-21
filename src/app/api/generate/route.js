// app/api/generate/route.js
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { fileData, text, model: modelName, mimeType: fileMimeType } = await req.json();

    // At least one input must be provided.
    if (!fileData && !text) {
      return NextResponse.json(
        { error: 'Provide at least fileData and/or a text prompt.' },
        { status: 400 }
      );
    }

    // Set default values if not provided.
    const modelToUse = modelName || 'models/gemini-2.0-flash';
    const mime = fileMimeType || 'application/pdf';

    // Build the payload for the AI call.
    const payload = [];

    if (fileData) {
      // Extract base64 content if a data URL is provided.
      const base64Data = fileData.includes('base64,')
        ? fileData.split('base64,')[1]
        : fileData;

      payload.push({
        inlineData: {
          data: base64Data,
          mimeType: mime,
        },
      });
    }

    if (text) {
      // Add the text prompt to the payload.
      payload.push(text);
    }

    // Initialize the Google AI client using your API key from env variables.
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelToUse });

    // Call the model with the constructed payload.
    const result = await model.generateContent(payload);

    // Extract the generated content from the response.
    const resp = result.response.candidates[0].content.parts[0].text;

    return NextResponse.json({ result: resp }, { status: 200 });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}