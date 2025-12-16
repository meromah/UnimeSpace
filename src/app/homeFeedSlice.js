import { createSlice } from "@reduxjs/toolkit";
import { mergeSortedBy } from "../utils";

const initialState = {
  items: [],
  page: 1,
  sortBy: "latest=1",
  itemType: "all",
  hasFetchRequest: false,
};

const homeFeedSlice = createSlice({
  name: "homeFeed",
  initialState,
  reducers: {
    mergeSorted: (state, action) => {
      const data1 = action.payload?.data1 || [];
      const data2 = action.payload?.data2 || [];
      const sortBy = action.payload.sortBy;
      const itemType = action.payload.itemType;
      const sortedItems = mergeSortedBy(data1, data2, sortBy);

      if (sortBy === state.sortBy && itemType === state.itemType) {
        state.items.push(...sortedItems);
        state.page = action.payload.page;
      } else {
        state.items = sortedItems;
        state.page = 1;
        state.sortBy = sortBy;
        state.itemType = itemType;
      }
    },
    setItems: (state, action) => {
      const data = action.payload?.data || [];
      const sortBy = action.payload.sortBy;
      const itemType = action.payload.itemType;

      if (sortBy === state.sortBy && itemType === state.itemType) {
        state.items.push(...data);
        state.page = action.payload.page;
      } else {
        state.items = data;
        state.page = 1;
        state.sortBy = sortBy;
        state.itemType = itemType;
      }
    },
    nextPage: (state) => {
      state.page += 1;
      state.hasFetchRequest = false
    },
    setHasFetchRequest: (state, action) => {
      state.hasFetchRequest = action.payload.state;
    },
    resetFeed: (state, action) => {
      state.items = [];
      state.page = 1;
      state.itemType = action.payload.itemType;
      state.sortBy = action.payload.sortBy;
    },
  },
});

export const {
  mergeSorted,
  setItems,
  nextPage,
  resetFeed,
  setHasFetchRequest,
} = homeFeedSlice.actions;
export default homeFeedSlice.reducer;
