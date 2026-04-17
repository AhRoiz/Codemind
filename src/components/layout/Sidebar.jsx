import React from 'react';
import HistoryList from '../../features/history/HistoryList';

const Sidebar = ({ history, onLoad, onClear, onDelete, onPin, onRename, onNewChat }) => {
  return (
    <div className="w-72 bg-[#161b22] border-r border-gray-800 flex flex-col hidden md:flex">
      {/* HEADER SIDEBAR */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-2">
        <h1 className="font-bold text-white tracking-widest text-lg">CodeMind</h1>
      </div>

      {/* NEW CHAT BUTTON */}
      <div className="p-3">
         <button onClick={onNewChat} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded flex justify-center items-center gap-2 text-sm transition-colors shadow-lg">
            + Percakapan Baru
         </button>
      </div>

      {/* LIST HISTORY */}
      <HistoryList 
        history={history} 
        onLoad={onLoad} 
        onClear={onClear}
        onDelete={onDelete} 
        onPin={onPin}       
        onRename={onRename} 
      />
    </div>
  );
};

export default Sidebar;