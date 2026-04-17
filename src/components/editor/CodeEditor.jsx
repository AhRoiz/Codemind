import React from 'react';

const CodeEditor = ({ code, onChange, zoom = 1 }) => {
  
  // Fungsi khusus menangani tombol Keyboard
  const handleKeyDown = (e) => {
    // 1. Handle tombol TAB (Indentasi)
    if (e.key === 'Tab') {
      e.preventDefault(); // Mencegah pindah fokus ke elemen lain
      
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;

      // Masukkan 2 spasi (atau 4 jika suka) di posisi kursor
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      
      onChange(newCode);

      // Kembalikan posisi kursor ke setelah spasi yang baru dibuat
      // Kita butuh setTimeout agar React merender ulang value dulu
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }

    // 2. Handle Enter untuk Auto Indent 
    // Jika user tekan Enter setelah kurung kurawal '{', otomatis indent baris baru
    if (e.key === 'Enter') {
        const value = e.target.value;
        const selectionStart = e.target.selectionStart;
        const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
        const currentLine = value.substring(lineStart, selectionStart);
        
        // Cek spasi di awal baris saat ini
        const match = currentLine.match(/^(\s*)/);
        const spaces = match ? match[1] : '';
        
        // Jika baris berakhir dengan '{', tambah indentasi ekstra
        const extraIndent = currentLine.trim().endsWith('{') ? '  ' : '';
        
        if (spaces || extraIndent) {
            e.preventDefault();
            const insert = '\n' + spaces + extraIndent;
            const newCode = code.substring(0, selectionStart) + insert + code.substring(e.target.selectionEnd);
            onChange(newCode);
            
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = selectionStart + insert.length;
            }, 0);
        }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] relative">
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown} // Pasang handler di sini
        style={{ fontSize: `${14 * zoom}px` }}
        className="flex-1 w-full h-full bg-transparent p-4 font-mono text-gray-300 resize-none focus:outline-none custom-scrollbar leading-6"
        spellCheck="false"
        placeholder="// Paste your code here..."
      />
      <div className="bg-[#161b22] px-3 py-1 text-[10px] text-gray-500 border-t border-gray-800 flex justify-between">
        <span>Ln {code.split('\n').length}, Col {code.length}</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
};

export default CodeEditor;