export const historyReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_STORAGE':
      return action.payload; // Load dari LocalStorage
      
    case 'ADD_ITEM':
      return [{ ...action.payload, pinned: false }, ...state]; // Default pinned: false
      
    case 'DELETE_ITEM':
      return state.filter(item => item.id !== action.payload);
      
    case 'CLEAR_HISTORY':
      return [];
      
    case 'TOGGLE_PIN':
      return state.map(item => 
        item.id === action.payload ? { ...item, pinned: !item.pinned } : item
      );

    case 'RENAME_ITEM':
      return state.map(item => 
        item.id === action.payload.id ? { ...item, title: action.payload.newTitle } : item
      );

    case 'UPDATE_ITEM':
      return state.map(item => 
        item.id === action.payload.id ? { ...item, ...action.payload.updates } : item
      );

    default:
      return state;
  }
};