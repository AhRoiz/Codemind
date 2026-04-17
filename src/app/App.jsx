import React, { useState, useRef } from 'react'; // Tambah useRef
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { Send } from 'lucide-react'; // Chat UI icon
import '../styles/scrollbar.css';

// Components
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import CodeEditor from '../components/editor/CodeEditor';
import OutputTabs from '../components/output/OutputTabs';
import ExplainView from '../components/output/ExplainView';
import FlowchartView from '../components/output/FlowchartView';
import ComplexityAuditDashboard from '../features/ai/ComplexityAuditDashboard';
import { SmartMarkdown } from '../utils/markdownRenderer';

// Hooks
import { useAI } from '../hooks/useAI';
import { useHistory } from '../hooks/useHistory';
import { usePdfExport } from '../hooks/usePdfExport'; // Import Hook Baru

const DEFAULT_CODE = `# Tulis kodemu di sini\nprint("Hello DevMind")`;

export default function App() {
  // Global State
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState('Python');
  const [mode, setMode] = useState('explain');
  const [activeTab, setActiveTab] = useState('explain');
  const [aiModel, setAiModel] = useState('gemini');
  const [zoom, setZoom] = useState(1);
  const [chatInput, setChatInput] = useState(''); // Chat input state
  const [currentRoomId, setCurrentRoomId] = useState(null); // Active room state

  // Refs (Untuk target screenshot PDF)
  const outputRef = useRef(null); // Ref baru

  // Hooks
  const { loading, explainOutput, auditOutput, chatHistory, mermaidCode, requestAnalysis, requestChat, setRoomState, resetAIState } = useAI();
  const { downloadPdf, isDownloading } = usePdfExport(); // Hook baru
  
  const { 
    history, addToHistory, clearHistory, 
    deleteItem, togglePin, renameItem, updateHistoryItem
  } = useHistory();

  // Handlers
  const handleGenerate = async (selectedMode) => {
    if (!code.trim()) return;
    
    let targetTab = 'explain';
    if (selectedMode === 'security') targetTab = 'audit';
    if (selectedMode === 'flowchart') targetTab = 'diagram';
    setActiveTab(targetTab);

    const { success, result, mermaid } = await requestAnalysis(selectedMode, language, code, aiModel);
    
    if (success) {
      const payload = {
        title: code.split('\n')[0].substring(0, 30) || "Untitled",
        code,
        lang: language,
        model: aiModel,
        mode: selectedMode // Tracks the latest primary action
      };
      
      const sessionUpdates = {
          explainOutput: selectedMode === 'explain' ? result : explainOutput,
          auditOutput: selectedMode === 'security' ? result : auditOutput,
          mermaidCode: selectedMode === 'flowchart' ? mermaid : mermaidCode,
          chatHistory: chatHistory
      };

      if (currentRoomId) {
        updateHistoryItem(currentRoomId, { ...payload, ...sessionUpdates });
      } else {
        const newId = addToHistory({ ...payload, ...sessionUpdates });
        setCurrentRoomId(newId);
      }
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim() || loading) return;
    const question = chatInput;
    setChatInput('');
    const { success } = await requestChat(language, code, aiModel, question);
    
    // Auto sync to history
    if (success && currentRoomId) {
       // useAI's state updates are fast enough, but to capture the latest chatHistory accurately we depend on it changing.
       // However, to keep it simple, we use a timeout since setChatHistory is async in useAI.
       setTimeout(() => {
          updateHistoryItem(currentRoomId, { mode: 'chat' }); // Real state triggers from useEffect if we wanted, or wait for next action.
       }, 500); 
    }

    setTimeout(() => {
      if(outputRef.current) outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const handleDownload = () => {
    // 1. Ambil Judul dari Baris Pertama Kode (seperti Logic Sidebar)
    const firstLine = code.split('\n')[0].replace(/['"#]+/g, '').trim();
    // Jika kosong, pakai default 'Untitled'
    const cleanTitle = firstLine.substring(0, 30) || 'devmind-result';
    
    // 2. Bersihkan karakter filename yang dilarang OS (/ \ : * ? " < > |)
    const safeFilename = cleanTitle.replace(/[^a-zA-Z0-9-_ ]/g, '');
    
    const fileName = `${safeFilename}-${mode}.pdf`;
    
    downloadPdf(outputRef, fileName);
  };

  const loadHistory = (item) => {
    if(window.confirm("Buka sesi ini dan ganti editor?")) {
      setCode(item.code);
      setLanguage(item.lang);
      setMode(item.mode === 'flowchart' ? 'flowchart' : item.mode === 'security' ? 'security' : 'explain');
      
      const loadedRoom = {
          explainOutput: item.explainOutput || (item.mode === 'explain' ? item.result : ''),
          auditOutput: item.auditOutput || (item.mode === 'security' ? item.result : ''),
          mermaidCode: item.mermaidCode || item.mermaid || '',
          chatHistory: item.chatHistory || []
      };
      
      setRoomState(loadedRoom);
      setCurrentRoomId(item.id);

      if (loadedRoom.mermaidCode) setActiveTab('diagram');
      else if (loadedRoom.auditOutput) setActiveTab('audit');
      else setActiveTab('explain');
    }
  };

  const startNewChat = () => {
    if(window.confirm("Mulai chat/sesi baru dan bersihkan layar?")) {
      setCode(DEFAULT_CODE);
      setCurrentRoomId(null);
      resetAIState();
      setActiveTab('explain');
      setChatInput('');
    }
  };

  return (
    <div className="flex h-screen bg-[#0d1117] text-gray-300 font-sans overflow-hidden">
      <Sidebar 
        history={history} onLoad={loadHistory} onClear={clearHistory} 
        onDelete={deleteItem} onPin={togglePin} onRename={renameItem}
        onNewChat={startNewChat}
      />
      
      <div className="flex-1 flex flex-col relative">
        <Header 
          language={language} setLanguage={setLanguage}
          mode={mode} setMode={setMode}
          onGenerate={handleGenerate} loading={loading}
          aiModel={aiModel} setAiModel={setAiModel}
          zoom={zoom} setZoom={setZoom}
        />

        <PanelGroup direction="horizontal" className="flex-1 overflow-hidden">
          <Panel defaultSize={50} minSize={20}>
            <CodeEditor code={code} onChange={setCode} zoom={zoom} />
          </Panel>
          
          <PanelResizeHandle className="w-1 bg-[#1c2128] hover:bg-cyan-500/50 transition-colors cursor-col-resize active:bg-cyan-500" />
          
          <Panel defaultSize={50} minSize={20}>
            <div className="flex flex-col bg-[#0d1117] h-full transform origin-top-left" style={{ zoom }}>
              <OutputTabs 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                hasExplain={!!explainOutput}
                hasAudit={!!auditOutput}
                hasDiagram={!!mermaidCode}
                onCopy={() => {
                  if (activeTab === 'explain') navigator.clipboard.writeText(explainOutput);
                  if (activeTab === 'audit') navigator.clipboard.writeText(auditOutput);
                }}
                onDownload={handleDownload} 
                isDownloading={isDownloading} 
              />

              <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#0d1117]">
                <div ref={outputRef} className="p-6 min-h-full bg-[#0d1117] flex flex-col">
                  
                  {loading && (
                    <div className="text-center mt-10 text-blue-400 animate-pulse text-sm font-mono">
                      Thinking...
                    </div>
                  )}
                  
                  {!loading && activeTab === 'audit' && auditOutput && (
                    <div className="pb-10 h-full w-full"> 
                      <ComplexityAuditDashboard output={auditOutput} />
                    </div>
                  )}
                  
                  {!loading && activeTab === 'explain' && explainOutput && (
                    <div className="pb-10 flex-1"> 
                      <ExplainView output={explainOutput} />
                    </div>
                  )}
                  
                  {!loading && activeTab === 'diagram' && mermaidCode && (
                    <div className="flex justify-center items-center min-h-[300px] pb-10">
                      <FlowchartView code={mermaidCode} />
                    </div>
                  )}

                  {/* Render Chat History as Bubbles */}
                  {!loading && chatHistory && chatHistory.length > 0 && (
                    <div className="mt-6 flex flex-col gap-4 border-t border-gray-800 pt-6">
                      {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xl ${
                            msg.role === 'user' 
                              ? 'bg-blue-600 text-white rounded-br-sm' 
                              : 'bg-[#161b22] border border-gray-700 text-gray-200 rounded-bl-sm'
                          }`}>
                            <div className="text-xs font-bold mb-2 opacity-70">
                              {msg.role === 'user' ? 'GUEST (You)' : 'CodeMind AI'}
                            </div>
                            <SmartMarkdown content={msg.content} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* CHAT INPUT AREA */}
              {(!!explainOutput || !!auditOutput || !!mermaidCode) && (
                <div className="p-4 bg-[#161b22] border-t border-gray-800 flex gap-2 shrink-0">
                  <input 
                    type="text" 
                    value={chatInput} 
                    onChange={e => setChatInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleChatSubmit()}
                    placeholder="Tanya lebih lanjut tentang kode ini (Chat)..." 
                    className="flex-1 bg-[#0d1117] text-sm text-gray-300 rounded px-3 py-2 border border-gray-700 outline-none focus:border-blue-500"
                    disabled={loading}
                  />
                  <button 
                    onClick={handleChatSubmit} 
                    disabled={loading || !chatInput.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2 w-10 flex items-center justify-center rounded transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}