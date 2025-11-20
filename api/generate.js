import { OpenAI } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { topic, grade, type, count } = req.body;

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `
Buatkan ${count} soal tipe ${type} untuk kelas ${grade}
topik: ${topic}.
Formatkan dalam teks biasa.
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    res.status(200).json({
      quizText: completion.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
