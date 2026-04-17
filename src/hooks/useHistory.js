import { useReducer, useEffect } from 'react';
import { historyReducer } from '../features/history/historySlice';

const STORAGE_KEY = 'devmind_history_v1';

export const useHistory = () => {
  // 1. Init state langsung dari LocalStorage saat pertama load
  const [history, dispatch] = useReducer(historyReducer, [], (initial) => {
    const persisted = localStorage.getItem(STORAGE_KEY);
    return persisted ? JSON.parse(persisted) : initial;
  });

  // 2. Setiap kali history berubah, simpan ke LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  // Actions Wrapper
  const addToHistory = (item) => {
    const newId = Date.now();
    dispatch({ type: 'ADD_ITEM', payload: { ...item, id: newId, date: new Date().toLocaleString() } });
    return newId;
  };
  const updateHistoryItem = (id, updates) => dispatch({ type: 'UPDATE_ITEM', payload: { id, updates } });
  const clearHistory = () => dispatch({ type: 'CLEAR_HISTORY' });
  const deleteItem = (id) => dispatch({ type: 'DELETE_ITEM', payload: id });
  const togglePin = (id) => dispatch({ type: 'TOGGLE_PIN', payload: id });
  const renameItem = (id, newTitle) => dispatch({ type: 'RENAME_ITEM', payload: { id, newTitle } });

  return { 
    history, 
    addToHistory, 
    clearHistory, 
    deleteItem, 
    togglePin, 
    renameItem,
    updateHistoryItem 
  };
};