import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPopUp: false,
  descName: null,
  draftTestId: null,
  draftTestData: {}
};
const createTestSlice = createSlice({
  name: "testMetadata",
  initialState,
  reducers: {
    setIsPopUp: (state, action) => {
      state.isPopUp = action.payload;
    },
    setDescName: (state, action) => {
      state.descName = action.payload;
    },
    setDraftTestId: (state, action) => {
      state.draftTestId = action.payload;
    },
    setDraftTestData: (state, action) => {
      const {payload} = action
      state.draftTestData = {...payload};
    },
  },
});

export const {
  setIsPopUp,
  setDescName,
  setDraftTestId,
  setDraftTestData
} = createTestSlice.actions;

export default createTestSlice.reducer;