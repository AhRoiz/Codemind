import React from 'react';
import { Copy, FileDown, Loader2 } from 'lucide-react'; // Import Icon Baru

const OutputTabs = ({ activeTab, setActiveTab, onCopy, onDownload, isDownloading, hasExplain, hasAudit, hasDiagram }) => {
  const hasOutput = hasExplain || hasAudit || hasDiagram;
  return (
    <div className="flex border-b border-gray-800 bg-[#161b22]">
      {hasExplain && (
        <button 
          onClick={() => setActiveTab('explain')} 
          className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 ${activeTab === 'explain' ? 'border-blue-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          Explanation
        </button>
      )}
      {hasAudit && (
        <button 
          onClick={() => setActiveTab('audit')} 
          className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 ${activeTab === 'audit' ? 'border-purple-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          Security Audit
        </button>
      )}
      {hasDiagram && (
        <button 
          onClick={() => setActiveTab('diagram')} 
          className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 ${activeTab === 'diagram' ? 'border-emerald-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          Visualization
        </button>
      )}
      
      <div className="flex-1 flex justify-end items-center px-2 gap-2">
         {hasOutput && (
           <>
             {/* TOMBOL COPY */}
             {(activeTab === 'explain' || activeTab === 'audit') && (
               <button onClick={onCopy} className="text-gray-500 hover:text-white flex items-center gap-1 text-[10px] px-2 py-1 rounded hover:bg-gray-800 transition-colors">
                 <Copy size={12} /> Copy
               </button>
             )}

             {/* TOMBOL DOWNLOAD PDF (BARU) */}
             <button 
                onClick={onDownload} 
                disabled={isDownloading}
                className="text-gray-500 hover:text-emerald-400 flex items-center gap-1 text-[10px] px-2 py-1 rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
             >
               {isDownloading ? <Loader2 size={12} className="animate-spin"/> : <FileDown size={12} />} 
               PDF
             </button>
           </>
         )}
      </div>
    </div>
  );
};

export default OutputTabs;