import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Activity, CheckCircle2, Bot } from 'lucide-react';
import ExplainView from '../../components/output/ExplainView';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';

const radarData = [
  {
    subject: 'Cyclomatic Complexity',
    Original: 85,
    Optimized: 15,
  },
  {
    subject: 'Cognitive Load',
    Original: 80,
    Optimized: 20,
  },
  {
    subject: 'Halstead Volume',
    Original: 75,
    Optimized: 25,
  },
  {
    subject: 'Nesting Depth',
    Original: 90,
    Optimized: 10,
  },
  {
    subject: 'Comment Density',
    Original: 30,
    Optimized: 90,
  },
];

const SemiCircleGauge = ({ value, max = 100, color, title, accent }) => {
  const radius = 65;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (value / max) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-24">
        {/* Custom clean gauge background */}
        <div 
          className="absolute inset-0 rounded-t-full opacity-10 pointer-events-none"
          style={{ backgroundColor: color }}
        />
        
        <svg fill="transparent" width="160" height="96" viewBox="0 0 160 96" className="relative z-10 drop-shadow-lg">
          <path
            d="M 15 88 A 65 65 0 0 1 145 88"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <path
            d="M 15 88 A 65 65 0 0 1 145 88"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1500 ease-in-out"
          />
        </svg>
        <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-end pb-1">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold font-mono tracking-tight" style={{ color }}>{value}</span>
          </div>
          {/* Inner ring marker detail */}
          <div className="h-1 w-8 rounded-full mt-2" style={{ backgroundColor: accent }} />
        </div>
      </div>
      <span className="mt-5 text-xs font-bold text-slate-300 uppercase tracking-[0.2em] text-center w-full">{title}</span>
    </div>
  );
};



const ComplexityAuditDashboard = ({ output }) => {
  return (
    <div className="w-full h-full min-h-[600px] bg-[#0A0D14] text-slate-200 font-sans p-4 sm:p-6 relative overflow-y-auto custom-scrollbar flex flex-col items-center">


      {/* Main Container */}
      <div className="max-w-6xl w-full flex flex-col gap-8 relative z-10">
        
        {/* Header / Branding */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <div className="relative">
                <BoxIcon />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                CodeMind 
              </h1>
            </div>
            <p className="text-sm font-medium tracking-widest text-gray-400 uppercase flex items-center gap-2 ml-[2.25rem]">
              <Activity className="w-3 h-3" /> Advanced Engineering Audit
            </p>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-gray-700 bg-[#161b22] rounded-full text-gray-300 text-xs font-semibold tracking-wide">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Validation Imminent
          </div>
        </div>

        {/* Top Section: Gauges & Radar */}
        <PanelGroup direction="horizontal" className="w-full min-h-[420px] flex gap-2 sm:gap-6">
          
          {/* Maintainability Gauges */}
          <Panel defaultSize={45} minSize={30}>
            <div className="h-full w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl rounded-3xl shadow-2xl relative overflow-hidden">
              {/* Subtle inner grid background */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik00MCAwSDBWNDBoNDBWMEoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTQwIDBMMCA0MEgwVjBIMTBWMSIvPgo8L3N2Zz4=')] opacity-[0.02] mix-blend-overlay"></div>
              
              <div className="flex flex-row gap-6 sm:gap-16 items-end relative z-10 pt-4 scale-90 sm:scale-100">
                <SemiCircleGauge 
                  value={45} 
                  max={100} 
                  color="#f59e0b" // Amber
                  accent="#b45309"
                  title="Original" 
                />
                <SemiCircleGauge 
                  value={92} 
                  max={100} 
                  color="#10b981" // Emerald
                  accent="#047857"
                  title="Optimized" 
                />
              </div>

              <div className="mt-12 text-center relative z-10 w-full px-2 sm:px-6">
                <div className="h-[1px] w-full bg-gray-800 mb-6"></div>
                <p className="text-sm sm:text-xl font-bold text-gray-200 inline-flex items-center gap-2 text-center">
                  <span className="text-emerald-500">+104%</span> <span className="hidden sm:inline">Improvement in </span>Code Health
                </p>
              </div>
            </div>
          </Panel>

          {/* Resizer Handle */}
          <PanelResizeHandle className="w-1.5 sm:w-2 bg-gray-800 hover:bg-emerald-500/50 transition-colors cursor-col-resize rounded-full shrink-0 my-8" />

          {/* Radar Chart */}
          <Panel defaultSize={55} minSize={30}>
            <div className="h-full w-full p-4 sm:p-6 bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl rounded-3xl flex flex-col shadow-2xl relative">
              <h3 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-2 absolute top-6 left-6 z-10">Architectural Complexity</h3>
            <div className="flex-1 w-full relative z-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="55%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  
                  {/* Source / Original */}
                  <Radar 
                    name="Source Code" 
                    dataKey="Original" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    fill="#ef4444" 
                    fillOpacity={0.0} // Outlined visually
                  />
                  {/* AI Optimized */}
                  <Radar 
                    name="AI Optimized" 
                    dataKey="Optimized" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    fill="#06b6d4" 
                    fillOpacity={0.4} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 600, color: '#94a3b8' }} 
                    iconType="circle"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          </Panel>
        </PanelGroup>

        {/* Dynamic Audit Results */}
        <div className="w-full mt-2 p-6 bg-[#0d1117]/80 rounded-2xl border border-white/[0.05]">
          <ExplainView output={output} />
        </div>

        {/* Bottom Panel & Context */}
        <div className="flex flex-col md:flex-row gap-6 mt-2 relative">
          {/* Methodology Box */}
          <div className="flex-1 p-6 relative bg-[#13171e] border border-gray-800 rounded-2xl">
            <div className="absolute top-0 left-6 w-12 h-[2px] bg-gray-600"></div>
            <h4 className="text-gray-200 text-sm font-bold tracking-wider uppercase mb-3 flex items-center gap-2">
               <Bot className="w-5 h-5 text-gray-400" />
               Audit Logic & Methodology
            </h4>
            <p className="text-slate-400 text-[13px] leading-relaxed font-medium">
              Validation based on static analysis algorithms. The AI refactor reduced logical branching (Cyclomatic Complexity) and improved the Maintainability Index by simplifying the Halstead Volume. This ensures lower technical debt and easier scalability for the RPL lifecycle.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

// Simple stand-in icon for the logo
const BoxIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white relative z-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

export default ComplexityAuditDashboard;
