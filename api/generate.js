import OpenAI from "openai";

export default async function handler(req, res) {
  // Hanya menerima POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Use POST." });
  }

  try {
    const { topic, grade, type, count } = req.body;

    if (!topic || !grade || !type || !count) {
      return res.status(400).json({ error: "Data tidak lengkap." });
    }

    // API KEY dari Environment Variable
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Prompt AI
    const prompt = `
Buatkan ${count} soal tipe ${type} untuk kelas ${grade}.
Topik: ${topic}
Formatkan dalam teks biasa yang rapi.
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
    });

    const hasil = completion.choices[0].message.content;

    return res.status(200).json({
      quizText: hasil,
    });

  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
