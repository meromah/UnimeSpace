import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  test: {
    title: null,
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
  reducers: {
    resetSession: ()=> initialState,
    initializeSession: (state, action) => {
      state.test.title = action.payload.test.title;
      state.test.id = action.payload.test.id;
      state.test.duration = action.payload.test?.duration ?? null;
      state.currentIndex = 0;
      state.submission = {};
      state.questions = action.payload.questions;
      state.meta.totalQuestions = action.payload.questions.length;
      state.meta.answeredCount = 0;
      state.meta.startedAt = null;

      // state.meta.submittedAt = null
      state.status = "ready";
    },
    startSession: (state) => {
      state.meta.startedAt = Date.now();
      state.currentIndex = 0;
      state.status = "in_progress";
    },
    setSubmission: (state, action) => {
      const id = action.payload.question_id;
      const questionType = action.payload.question_type;
      switch (questionType) {
        case "mcq":
          const optionId = action.payload.option_id;
          if (Array.isArray(state.submission[id])) {
            state.submission[id].push(optionId);
          } else {
            state.submission[id] = [optionId];
          }
          break;
        case "code":
          state.submission[id] = action.payload.code;
          break;
      }
    },
    setOriginalSubmission: (state, action)=>{
      const {id, data} = action.payload
      state.submission[id] = data
    },
    removeOption: (state, action) => {
      const id = action.payload.question_id;
      const optionId = action.payload.option_id;
      if (
        Array.isArray(state.submission[id]) &&
        state.submission[id].length > 0
      ) {
        state.submission[id] = state.submission[id].filter(
          (itemId) => itemId !== optionId
        );
      }
    },
    goToNextQuestion: (state) => {
      const totalQuestions = state.questions.length;
      const currentIndex = state.currentIndex;
      if (totalQuestions > currentIndex + 1) {
        state.currentIndex = currentIndex + 1;
      }
    },
    goToPreviousQuestion: (state) => {
      const currentIndex = state.currentIndex;
      if (0 < currentIndex) {
        state.currentIndex = currentIndex - 1;
      }
    },
    enterReview: (state) => {
      state.status = "review";
    },
    jumpToQuestion: (state, action)=> {
      const questionIdx = action.payload.questionIndex
      const newStatus = action.payload.newStatus
      state.status = newStatus;
      state.currentIndex = questionIdx
    },
    completeTest: (state)=>{
      state.status = 'completed'
      state.currentIndex = null

    }
  },
});

export const {
  initializeSession,
  startSession,
  setSubmission,
  removeOption,
  goToNextQuestion,
  goToPreviousQuestion,
  enterReview,
  jumpToQuestion,
  resetSession,
  setOriginalSubmission,
  completeTest
} = testSessionSlice.actions;
export default testSessionSlice.reducer;
