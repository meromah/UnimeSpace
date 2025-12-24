import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  test: {
    id: null,
    duration: null,
  },
  questions: [], // immutable once loaded

  submission: {},
  currentIndex: 0,
  meta: {
    totalQuestions: 0,
    answeredCount: 0,
    startedAt: null,
    // submittedAt: null,
    // timeRemaining: null
  },

  ui: {
    // isRestoring: boolean
    error: null,
  },
};

const testSessionSlice = createSlice({
  name: "testSession",
  initialState,
  reducers: {},
});

export const { } =
  testSessionSlice.actions;
export default testSessionSlice.reducer;
