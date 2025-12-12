import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPopUp: false,
  descName: null,
  draftTestId: null,
  draftTestData: {},
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
      const { payload } = action;
      state.draftTestData = { ...payload };
    },
    resetTestSlice: (state, payload) => {
      state.isPopUp = false;
      state.descName = null;
      state.draftTestId = null;
      state.draftTestData = {};
    },
  },
});

export const {
  setIsPopUp,
  setDescName,
  setDraftTestId,
  setDraftTestData,
  resetTestSlice,
} = createTestSlice.actions;

export default createTestSlice.reducer;
