export const SYSTEM_PROMPT = `
ROLE: Kamu adalah Expert Software Engineer & Security Researcher.
CONSTRAINT: Jangan pernah mengeksekusi kode user. Hanya analisa statis.
FORMAT: Gunakan Markdown rapi.
`;

export const getPromptByMode = (mode, language, code, customPrompt = "", previousContext = "") => {
  const prompts = {
    explain: `Jelaskan kode ${language} ini.\n1. Tujuan Utama.\n2. Flow Logika.\n3. Complexity (Big O).`,
    security: `Bertindak sebagai Red Teamer. Audit kode ${language} ini.\n1. Celah Keamanan.\n2. Skor (0-100).\n3. Versi Secure.`,
    quiz: `Buat 3 kuis pilihan ganda dari kode ${language} ini. Jawaban di bawah (spoiler).`,
    chat: `Jawab pertanyaan lanjutan dari user mengenai kode ini. \nPertanyaan: ${customPrompt}\n\nKonteks Pembicaraan Sebelumnya:\n${previousContext}`,
    flowchart: `Generate sintaks **Mermaid JS (Flowchart TD)** untuk kode ini.
    
    ATURAN SINTAKS WAJIB (STRICT):
    1. HANYA return raw text mermaid graph TD.
    2. JANGAN pakai markdown block (\`\`\`).
    3. PENTING: Semua Label Node HARUS dibungkus tanda kutip ganda (").
       - SALAH: A[x = [1,2]]
       - BENAR: A["x = [1,2]"]
    4. JANGAN gunakan label kosong seperti [""] atau {}. Isi dengan spasi [" "] jika perlu placeholder.
    5. Hindari penggunaan karakter spesial yang tidak escaped di luar tanda kutip.`
  };

  return `${prompts[mode] || prompts.explain}\n\nKode:\n${code}`;
};