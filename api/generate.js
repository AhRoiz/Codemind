// api/generate.js
// Kode ini berjalan di SERVER Vercel, bukan di browser user.

export default async function handler(req, res) {
  // 1. Cek method (hanya terima POST)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Ambil API Key dari Environment Variable Vercel (bukan dari file .env lokal)
  const API_KEY = process.env.GEMINI_API_KEY; 

  if (!API_KEY) {
    return res.status(500).json({ error: 'API Key server configuration missing' });
  }

  const { prompt } = req.body;

  try {
    // 3. Request ke Google Gemini dari Server
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-exp:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );

    const data = await response.json();

    // 4. Kirim hasil balik ke Frontend
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}