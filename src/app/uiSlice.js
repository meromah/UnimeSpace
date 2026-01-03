import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return 'light'; // Default for SSR
  }
  
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      return saved;
    }
  } catch (e) {
    // localStorage might not be available
    console.warn("localStorage not available:", e);
  }

  // Fallback to system preference
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch (e) {
    return "light"; // Final fallback
  }
};
const initialState = {
  sidebarMobileHeight: 0,
  theme: getInitialTheme(),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
   setSidebarMobileHeight: (state, action)=> {
    state.sidebarMobileHeight = action.payload.height
   },
   toggleTheme: (state)=> {
    state.theme = state.theme === "light"? "dark": "light"
   },
   setTheme: (state, action)=>{
    state.theme = action.payload
   }
  },
});

export const {setSidebarMobileHeight, toggleTheme, setTheme  } = uiSlice.actions;
export default uiSlice.reducer;
