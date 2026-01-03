import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarMobileHeight: 0,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
   setSidebarMobileHeight: (state, action)=> {
    state.sidebarMobileHeight = action.payload.height
   }
  },
});

export const {setSidebarMobileHeight  } = uiSlice.actions;
export default uiSlice.reducer;
