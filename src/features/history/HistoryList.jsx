import React, { useState } from 'react';
import { History, Trash2, Pin, MoreHorizontal, Edit2, Check, X, PinOff } from 'lucide-react';

const HistoryItem = ({ item, onLoad, onDelete, onPin, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [showMenu, setShowMenu] = useState(false);

  const handleSave = () => {
    if (editTitle.trim()) onRename(item.id, editTitle);
    setIsEditing(false);
    setShowMenu(false);
  };

  return (
    <div className="group relative p-3 mb-2 rounded border border-transparent hover:border-gray-700 hover:bg-gray-800/50 transition-all">
      {/* HEADER ITEM */}
      <div className="flex justify-between items-start mb-1">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
          item.mode === 'security' ? 'bg-red-900/30 text-red-400' :
          item.mode === 'flowchart' ? 'bg-emerald-900/30 text-emerald-400' :
          item.mode === 'quiz' ? 'bg-purple-900/30 text-purple-400' :
          'bg-blue-900/30 text-blue-400'
        }`}>{item.mode} {item.model === 'qwen3-local' ? '(Local)' : item.model === 'gemini' ? '(Gemini)' : ''}</span>
        
        {/* ICON PINNED (Jika aktif) */}
        {item.pinned && <Pin size={10} className="text-emerald-500 fill-emerald-500 rotate-45" />}
      </div>

      {/* CONTENT: TITLE ATAU EDIT FORM */}
      {isEditing ? (
        <div className="flex items-center gap-1 mt-1">
          <input 
            autoFocus
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full bg-gray-900 text-xs text-white p-1 rounded border border-blue-500 outline-none"
          />
          <button onClick={handleSave} className="text-emerald-500 hover:bg-gray-700 p-1 rounded"><Check size={12}/></button>
          <button onClick={() => setIsEditing(false)} className="text-red-500 hover:bg-gray-700 p-1 rounded"><X size={12}/></button>
        </div>
      ) : (
        <div onClick={() => onLoad(item)} className="cursor-pointer">
          <p className="text-xs text-gray-300 font-mono truncate mb-1">{item.title}</p>
          <p className="text-[10px] text-gray-600">{item.date}</p>
        </div>
      )}

      {/* ACTION MENU (HOVER ONLY) */}
      {!isEditing && (
        <div className="absolute right-2 top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-[#161b22] shadow-lg rounded border border-gray-700 p-1">
          <button onClick={() => onPin(item.id)} title={item.pinned ? "Unpin" : "Pin"} className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white">
            {item.pinned ? <PinOff size={12}/> : <Pin size={12}/>}
          </button>
          <button onClick={() => { setIsEditing(true); setEditTitle(item.title); }} title="Rename" className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-blue-400">
            <Edit2 size={12}/>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} title="Delete" className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400">
            <Trash2 size={12}/>
          </button>
        </div>
      )}
    </div>
  );
};

const HistoryList = ({ history, onLoad, onClear, onDelete, onPin, onRename }) => {
  const pinnedItems = history.filter(i => i.pinned);
  const recentItems = history.filter(i => !i.pinned);

  if (history.length === 0) return (
    <div className="p-4 text-center text-gray-600 text-xs mt-10">
      <History className="w-8 h-8 mx-auto mb-2 opacity-30" />
      <p>Belum ada riwayat.</p>
    </div>
  );

  return (
    <>
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        {/* PINNED SECTION */}
        {pinnedItems.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 px-2 flex items-center gap-1">
              <Pin size={10} /> Pinned
            </p>
            {pinnedItems.map(item => (
              <HistoryItem key={item.id} item={item} onLoad={onLoad} onDelete={onDelete} onPin={onPin} onRename={onRename} />
            ))}
          </div>
        )}

        {/* RECENT SECTION */}
        {recentItems.length > 0 && (
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 px-2">Recent</p>
            {recentItems.map(item => (
              <HistoryItem key={item.id} item={item} onLoad={onLoad} onDelete={onDelete} onPin={onPin} onRename={onRename} />
            ))}
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-gray-800">
        <button onClick={onClear} className="w-full flex justify-center items-center gap-2 text-xs text-gray-500 hover:text-red-400 py-2 transition-colors">
          <Trash2 size={12} /> Clear All
        </button>
      </div>
    </>
  );
};

export default HistoryList;