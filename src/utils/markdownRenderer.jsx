import React from 'react';

export const SmartMarkdown = ({ content }) => {
  if (!content) return null;

  // 1. Helper untuk parsing inline (Bold, Italic, Code, Bold+Italic)
  const parseInline = (text) => {
    // Regex yang lebih "rakus" dan pintar:
    // 1. Code Block inline (`...`)
    // 2. Bold (**) yang membolehkan satu bintang di dalamnya (untuk matematika seperti O(N*M))
    // 3. Italic (*)
    const parts = text.split(/(`[^`]+`|\*\*(?:[^*]|\*(?!\*))+\*\*|\*[^*]+\*)/g);
    
    return parts.map((part, index) => {
      // Handle Code Inline: `text`
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="bg-gray-800 text-red-300 px-1.5 py-0.5 rounded font-mono text-xs mx-1 border border-gray-700">
            {part.slice(1, -1)}
          </code>
        );
      }
      // Handle Bold: **text**
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-blue-300 font-bold">{part.slice(2, -2)}</strong>;
      }
      // Handle Italic: *text*
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className="italic text-gray-400">{part.slice(1, -1)}</em>;
      }
      // Text Biasa
      return part;
    });
  };

  const lines = content.split('\n');
  let output = [];
  let inCodeBlock = false;
  let codeBlockContent = [];

  lines.forEach((line, idx) => {
    // 2. Handle Code Block (```)
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // Render block code selesai
        output.push(
          <div key={`code-${idx}`} className="my-4 bg-[#0d1117] border border-gray-700 rounded-md overflow-hidden shadow-sm">
            <pre className="p-4 overflow-x-auto text-sm font-mono text-emerald-400 leading-relaxed">
              {codeBlockContent.join('\n')}
            </pre>
          </div>
        );
        inCodeBlock = false;
        codeBlockContent = [];
      } else {
        // Mulai block code
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }

    const trimmed = line.trim();

    // 3. Handle Horizontal Rule (Garis ---) [FIXED]
    if (trimmed === '---' || trimmed === '***') {
      output.push(<hr key={idx} className="my-6 border-gray-700" />);
      return;
    }

    // 4. Handle Headers (H1 - H4) [FIXED: Added H4]
    if (line.startsWith('#### ')) {
      output.push(<h4 key={idx} className="text-base font-bold text-purple-300 mt-4 mb-2">{parseInline(line.slice(5))}</h4>);
      return;
    }
    if (line.startsWith('### ')) {
      output.push(<h3 key={idx} className="text-lg font-bold text-emerald-400 mt-6 mb-3">{parseInline(line.slice(4))}</h3>);
      return;
    }
    if (line.startsWith('## ')) {
      output.push(<h2 key={idx} className="text-xl font-bold text-blue-400 mt-8 mb-4 border-b border-gray-800 pb-2">{parseInline(line.slice(3))}</h2>);
      return;
    }
    if (line.startsWith('# ')) {
      output.push(<h1 key={idx} className="text-2xl font-extrabold text-white mt-8 mb-6">{parseInline(line.slice(2))}</h1>);
      return;
    }

    // 5. Handle List Item (* atau -)
    if (/^(\-|\*)\s/.test(trimmed)) {
      // Hapus simbol list dan spasi, lalu trim lagi agar bersih
      const cleanText = trimmed.replace(/^(\-|\*)\s/, '').trim();
      output.push(
        <li key={idx} className="ml-4 list-disc text-gray-300 mb-1.5 pl-2 marker:text-emerald-500 leading-7">
          {parseInline(cleanText)}
        </li>
      );
      return;
    }

    // 6. Handle Ordered List (1. Text)
    if (/^\d+\.\s/.test(trimmed)) {
      const cleanText = trimmed.replace(/^\d+\.\s/, '').trim();
      output.push(
        <li key={idx} className="ml-4 list-decimal text-gray-300 mb-1.5 pl-2 marker:text-blue-500 leading-7">
          {parseInline(cleanText)}
        </li>
      );
      return;
    }

    // 7. Handle Paragraf Kosong
    if (trimmed === '') {
      output.push(<div key={idx} className="h-3"></div>);
      return;
    }

    // 8. Paragraf Biasa
    output.push(<p key={idx} className="text-gray-300 leading-7 mb-2">{parseInline(line)}</p>);
  });

  return <div className="font-sans text-sm">{output}</div>;
};

export default SmartMarkdown;