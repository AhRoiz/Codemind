import { useState } from 'react';
import { generateContent } from '../features/ai/aiService';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [explainOutput, setExplainOutput] = useState('');
  const [auditOutput, setAuditOutput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [mermaidCode, setMermaidCode] = useState('');
  const [error, setError] = useState(null);

  const setRoomState = (room) => {
    setExplainOutput(room.explainOutput || '');
    setAuditOutput(room.auditOutput || '');
    setMermaidCode(room.mermaidCode || '');
    setChatHistory(room.chatHistory || []);
    setError(null);
  };

  const resetAIState = () => {
    setExplainOutput('');
    setAuditOutput('');
    setMermaidCode('');
    setChatHistory([]);
    setError(null);
  };

  const requestAnalysis = async (mode, language, code, aiModel) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await generateContent(mode, language, code, aiModel);
      
      if (mode === 'flowchart') {
        const cleanMermaid = result.replace(/```mermaid/g, '').replace(/```/g, '').trim();
        setMermaidCode(cleanMermaid);
      } else if (mode === 'security') {
        setAuditOutput(result);
      } else {
        setExplainOutput(result);
      }
      return { success: true, result, mermaid: mode === 'flowchart' ? result : '' };
    } catch (err) {
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const requestChat = async (language, code, aiModel, customPrompt) => {
    setLoading(true);
    setError(null);
    
    const userMsg = { role: 'user', content: customPrompt };
    setChatHistory(prev => [...prev, userMsg]);

    try {
      const historyContext = chatHistory.map(msg => `**${msg.role === 'user' ? 'You' : 'CodeMind'}**: ${msg.content}`).join('\n\n');
      const baseContext = `[Context Koding]\n${explainOutput || auditOutput || mermaidCode}\n\n`;
      const combinedContext = baseContext + historyContext;

      const result = await generateContent('chat', language, code, aiModel, customPrompt, combinedContext);
      
      const modelMsg = { role: 'model', content: result };
      setChatHistory(prev => [...prev, modelMsg]);
      return { success: true, result };
    } catch (err) {
      setError(err.message);
      setChatHistory(prev => [...prev, { role: 'model', content: `### ❌ Chat Error\n${err.message}` }]);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { loading, explainOutput, auditOutput, chatHistory, mermaidCode, error, requestAnalysis, requestChat, setRoomState, resetAIState };
};