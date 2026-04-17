import React from 'react';
import { GitGraph } from 'lucide-react';
import MermaidChart from '../mermaid/MermaidChart';

const FlowchartView = ({ code }) => {
  if (!code) return (
    <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
      <GitGraph size={48} className="mb-4" />
      <p className="text-sm">No visualization generated.</p>
    </div>
  );
  return <MermaidChart chart={code} />;
};
export default FlowchartView;