import { SYSTEM_PROMPT, getPromptByMode } from './prompts';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateContent = async (mode, language, code, aiModel = 'gemini', customPrompt = "", previousContext = "") => {
  const userPrompt = getPromptByMode(mode, language, code, customPrompt, previousContext);
  const fullPrompt = SYSTEM_PROMPT + "\n\n" + userPrompt;

  // --- LOGIKA LOCAL MODEL (OLLAMA / QWEN3) ---
  if (aiModel === 'qwen3-local') {
    console.log("Environment: Local (Ollama qwen3-coder:480b-cloud)");

    // Ganti URL dengan endpoint lokal jika berbeda
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3-coder:480b-cloud', // atau sesuai nama model di server lokal
        prompt: fullPrompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error("Gagal terhubung ke model lokal. Pastikan server lokal berjalan.");
    }
    const data = await response.json();
    return data.response || "No response.";
  }

  // --- LOGIKA HYBRID GEMINI ---
  // Jika di Localhost (DEV), tembak langsung ke Google agar cepat/mudah debug
  if (import.meta.env.DEV) {
    console.log("Environment: Development (Direct API Call)");

    if (!API_KEY) throw new Error("API Key tidak ditemukan di .env (VITE_GEMINI_API_KEY)");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
      }
    );

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
  }

  // Jika di Production (Sudah Deploy), gunakan jalur aman via Backend Proxy
  else {
    console.log("Environment: Production (Proxy API Call)");

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: fullPrompt })
    });

    // Cek apakah response sukses (bukan 404/500 HTML page)
    if (!response.ok) {
      // Coba baca text errornya kalau bukan JSON
      const text = await response.text();
      try {
        const json = JSON.parse(text);
        throw new Error(json.error || "Server Error");
      } catch (e) {
        throw new Error(`Server Error: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
  }
};