import { createSlice } from "@reduxjs/toolkit";
import { mergeSortedBy } from "../utils";
import { TabFilters } from "../utils/tabFilters";
const tabFilters = new TabFilters();
const firstTab = tabFilters.firstValue();
const secondTab = tabFilters.secondValue();
const initialState = {
  activeTab: firstTab,
  items: {
    [firstTab]: [],
    [secondTab]: [],
  },
  page: {
    [firstTab]: 1,
    [secondTab]: 1,
  },
  sortBy: "latest=1",
  itemType: "all",
  hasFetchRequest: {
    [firstTab]: false,
    [secondTab]: false,
  },
};

const homeFeedSlice = createSlice({
  name: "homeFeed",
  initialState,
  reducers: {
    mergeSorted: (state, action) => {
      const data1 = action.payload?.data1 || [];
      const data2 = action.payload?.data2 || [];
      const tab = action.payload.tab;
      const hasTabChanged = tab !== state.activeTab;

      if (tab === firstTab) {
        const sortBy = action.payload.sortBy;
        const itemType = action.payload.itemType;
        const sortedItems = mergeSortedBy(data1, data2, sortBy);
        if (sortBy === state.sortBy && itemType === state.itemType) {
          if (!hasTabChanged) {
            state.items[tab].push(...sortedItems);
            state.page[tab] = action.payload.page;
          }
        } else {
          state.items[tab] = sortedItems;
          state.page[tab] = 1;
          state.sortBy = sortBy;
          state.itemType = itemType;
        }
      } 
      if (tab === secondTab) {
        const sortedItems = mergeSortedBy(data1, data2, "latest=1");
        if (!hasTabChanged) {
          state.items[tab].push(...sortedItems);
          state.page[tab] = action.payload.page;
        }
        if (hasTabChanged && state.page[tab] === 1) {
          state.items[tab] = sortedItems
        }
      }
      state.activeTab = tab;
    },
    setItems: (state, action) => {
      const data = action.payload?.data || [];
      const sortBy = action.payload.sortBy;
      const itemType = action.payload.itemType;
      const tab = action.payload.tab;

      if (tab === firstTab) {
        if (sortBy === state.sortBy && itemType === state.itemType) {
          state.items[tab].push(...data);
          state.page[tab] = action.payload.page;
        } else {
          state.items[tab] = data;
          state.page[tab] = 1;
          state.sortBy = sortBy;
          state.itemType = itemType;
        }
      } else if (tab === secondTab) {
        if (state.items[tab].length > 0) {
          state.items[tab].push(...data);
          state.page[tab] = action.payload.page;
        } else {
          state.items[tab] = [...data];
          state.page[tab] = 1;
        }
      }
      state.activeTab = tab;
    },
    nextPage: (state, action) => {
      const tab = action.payload.tab;
      state.page[tab] += 1;
      state.hasFetchRequest[tab] = false;
      state.activeTab = tab;
    },
    setHasFetchRequest: (state, action) => {
      const tab = action.payload.tab
      state.hasFetchRequest[tab] = action.payload.state;
      state.activeTab = tab
    },
    resetFeed: (state, action) => {
      const tab = action.payload.tab;
      state.items[tab] = [];
      state.page[tab] = 1;
      if (tab === firstTab) {
        state.itemType = action.payload.itemType;
        state.sortBy = action.payload.sortBy;
      }
      state.hasFetchRequest[tab] = true
      state.activeTab = tab;
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
