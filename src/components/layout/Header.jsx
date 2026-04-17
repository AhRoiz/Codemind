import React from 'react';
import { Code, GitGraph, ShieldAlert, CheckCircle, Loader2, ZoomIn, ZoomOut } from 'lucide-react';

const Header = ({ language, setLanguage, mode, setMode, onGenerate, loading, aiModel, setAiModel, zoom, setZoom }) => {
  const modes = [
    { id: 'explain', icon: Code, label: 'Explain', color: 'bg-blue-600' },
    { id: 'flowchart', icon: GitGraph, label: 'Diagram', color: 'bg-emerald-600' },
    { id: 'security', icon: ShieldAlert, label: 'Audit', color: 'bg-red-600' },
    { id: 'quiz', icon: CheckCircle, label: 'Quiz', color: 'bg-purple-600' }
  ];

  return (
    <div className="h-14 border-b border-gray-800 bg-[#0d1117] flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <select
          value={language} onChange={(e) => setLanguage(e.target.value)}
          className="bg-[#161b22] border border-gray-700 text-xs rounded px-2 py-1.5 text-gray-300"
        >
          {['Python', 'JavaScript', 'C++', 'Go', 'Java'].map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select
          value={aiModel} onChange={(e) => setAiModel(e.target.value)}
          className="bg-[#161b22] border border-indigo-700 text-xs font-semibold rounded px-2 py-1.5 text-indigo-300"
        >
          <option value="gemini">AI API (Gemini)</option>
          <option value="qwen3-local">Local: qwen3-coder:480b-cloud</option>
        </select>
        <div className="h-4 w-px bg-gray-800 mx-2"></div>
        <div className="flex gap-2">
          {modes.map(btn => (
            <button
              key={btn.id}
              onClick={() => { setMode(btn.id); onGenerate(btn.id); }}
              disabled={loading}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold text-white transition-all ${btn.color} ${mode === btn.id ? 'ring-2 ring-white/20' : ''}`}
            >
              {loading && mode === btn.id ? <Loader2 className="animate-spin w-3 h-3" /> : <btn.icon className="w-3 h-3" />}
              {btn.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Zoom Controls */}
      <div className="flex gap-2 items-center ml-auto bg-[#161b22] px-2 py-1 rounded border border-gray-800">
        <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="text-gray-400 hover:text-white transition-colors" title="Zoom Out">
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono text-gray-400 w-10 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="text-gray-400 hover:text-white transition-colors" title="Zoom In">
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default Header;