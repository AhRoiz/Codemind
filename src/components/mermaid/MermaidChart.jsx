import React, { useState, useEffect, useRef } from 'react';

const MermaidChart = ({ chart }) => {
  const containerRef = useRef(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const initMermaid = async () => {
      setError(false);
      if (!chart) return;

      // 1. CLEANING CODE (FIX UTAMA)
      // Mengubah [""] menjadi [" "] (spasi) agar tidak crash
      // Dan menghapus karakter aneh yang mungkin terselip
      const cleanChart = chart
        .replace(/\[""\]/g, '[" "]') 
        .replace(/\\n/g, '<br/>'); // Opsional: support newline di label

      if (!window.mermaid) {
        const script = document.createElement('script');
        // Gunakan versi 10.9.0 yang stabil
        script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/mermaid.min.js';
        script.onload = () => setRetry(r => r + 1);
        script.onerror = () => setError(true);
        document.body.appendChild(script);
        return;
      }

      try {
        window.mermaid.initialize({ 
          startOnLoad: false, 
          theme: 'dark', 
          securityLevel: 'loose',
          flowchart: { useMaxWidth: true, htmlLabels: true }
        });
        
        if (containerRef.current) {
          containerRef.current.innerHTML = ''; 
          const id = `mermaid-${Date.now()}`;
          
          // Render menggunakan code yang sudah dibersihkan
          const { svg } = await window.mermaid.render(id, cleanChart);
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error("Mermaid Render Error:", err);
        setError(true);
        // Fallback: Tampilkan error text jika gagal total
        if(containerRef.current) containerRef.current.innerHTML = `<pre class="text-red-400 text-xs p-2">${err.message}</pre>`; 
      }
    };

    initMermaid();
  }, [chart, retry]);

  if (error) return (
    <div className="p-4 border border-red-800 bg-red-900/20 rounded text-red-300 text-xs font-mono overflow-auto max-h-60">
      <p className="font-bold mb-2">Gagal merender diagram. Raw Code:</p>
      <pre className="whitespace-pre">{chart}</pre>
    </div>
  );

  return <div ref={containerRef} className="overflow-x-auto p-4 bg-[#0d1117] border border-gray-700 rounded-lg flex justify-center min-h-[100px]" />;
};

export default MermaidChart;