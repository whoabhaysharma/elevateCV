import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text") || "";
    const fileData = searchParams.get("fileData") || "";

    if (!fileData && !text) {
      return new Response(
        JSON.stringify({ error: "Provide at least fileData and/or a text prompt." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const modelName = searchParams.get("model") || "gemini-1.5-flash";
    const fileMimeType = searchParams.get("mimeType") || "application/pdf";

    const payload = [];
    if (fileData) {
      const base64Data = fileData.includes("base64,")
        ? fileData.split("base64,")[1]
        : fileData;
      payload.push({
        inlineData: {
          data: base64Data,
          mimeType: fileMimeType,
        },
      });
    }
    if (text) {
      payload.push(text);
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });

    // Generate content as a stream
    const result = await model.generateContentStream(payload);

    // Create a ReadableStream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const rawText = await chunk.text();
            const message = `data: ${JSON.stringify({ text: rawText })}\n\n`; // Proper SSE format
            controller.enqueue(new TextEncoder().encode(message));
          }
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          console.error("Streaming error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
