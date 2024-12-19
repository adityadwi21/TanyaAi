import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  // Mendapatkan body dari request
  const { prompt } = await req.json();

  if (!prompt) {
    return new Response(JSON.stringify({ error: "Prompt is required" }), {
      status: 400,
    });
  }

  try {
    // Inisialisasi Google Generative AI dengan API Key Anda
    const genAI = new GoogleGenerativeAI("AIzaSyCKcQ7D1FEM6lQOwwUB4JLPfGQuvWleNPE");

    // Menggunakan model Gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Menghasilkan konten berdasarkan prompt
    const result = await model.generateContent(prompt);

    // Mengembalikan respons sebagai JSON
    return new Response(JSON.stringify({ response: result.response.text() }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating response:", error);
    return new Response(JSON.stringify({ error: "Failed to generate response" }), { status: 500 });
  }
}
