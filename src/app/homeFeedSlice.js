import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: {
    posts: [],
    tests: [],
  },
  firstPageItems: {
    posts: [],
    tests: [],
  },
  page: {
    posts: 1,
    tests: 1,
  },
  sortBy: "latest=1",
  itemType: "tests",
  hasFetchRequest: {
    posts: false,
    tests: false,
  },
};

const homeFeedSlice = createSlice({
  name: "homeFeed",
  initialState,
  reducers: {
    resetHomeFeed: () => initialState,
    setItems: (state, action) => {
      const data = action.payload?.data || [];
      const sortBy = action.payload.sortBy;
      const itemType = action.payload.itemType;
      
      if (state.page[itemType] === 1 && data.length > 0) {
        state.firstPageItems[itemType] = data;
      }

      if (sortBy === state.sortBy && itemType === state.itemType) {
        // Prevent duplicates when pushing
        const existingIds = new Set(state.items[itemType].map(item => item.id));
        const newData = data.filter(item => !existingIds.has(item.id));
        
        if (newData.length > 0) {
          state.items[itemType].push(...newData);
          state.page[itemType] = action.payload.page;
        }
      } else {
        state.items[itemType] = data;
        state.page[itemType] = 1;
        state.sortBy = sortBy;
        state.itemType = itemType;
      }
    },
    nextPage: (state, action) => {
      const itemType = action.payload.itemType;
      state.page[itemType] += 1;
      state.hasFetchRequest[itemType] = false;
    },
    setHasFetchRequest: (state, action) => {
      const itemType = action.payload.itemType;
      state.hasFetchRequest[itemType] = action.payload.state;
    },
    resetTab: (state, action) => {
      const itemType = action.payload.itemType;
      state.items[itemType] = state.firstPageItems[itemType];
      state.page[itemType] = 1;
      state.itemType = action.payload.itemType;
      state.sortBy = action.payload.sortBy;
      state.hasFetchRequest[itemType] = false;
    },
    removeItem: (state, action) => {
      const { itemId, itemType } = action.payload;
      state.items.posts = state.items.posts.filter((item) => {
        const iType = Object.prototype.hasOwnProperty.call(item, "board")
          ? "post"
          : "test";
        return !(item.id === itemId && iType === itemType);
      });

      state.items.tests = state.items.tests.filter((item) => {
        const iType = Object.prototype.hasOwnProperty.call(item, "board")
          ? "post"
          : "test";
        return !(item.id === itemId && iType === itemType);
      });
    },
  },
});

export const {
  resetHomeFeed,
  setItems,
  nextPage,
  resetTab,
  setHasFetchRequest,
  removeItem,
} = homeFeedSlice.actions;
export default homeFeedSlice.reducer;
