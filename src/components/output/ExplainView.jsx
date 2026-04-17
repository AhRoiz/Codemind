import React from 'react';
import { Terminal } from 'lucide-react';
import { SmartMarkdown } from '../../utils/markdownRenderer';

const ExplainView = ({ output }) => {
  if (!output) return (
    <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
      <Terminal size={48} className="mb-4" />
      <p className="text-sm">Ready to analyze code.</p>
    </div>
  );
  return <SmartMarkdown content={output} />;
};
export default ExplainView;