import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import myProfileReducer from "./myProfileSlice"
import createTestReducer from './createTestSlice'
import homeFeedReducer from './homeFeedSlice'
import testSessionSlice from './testSessionSlice'
import recentCommunitiesReducer, { recentCommunitiesMiddleware } from "./recentCommunitiesSlice"
import { baseApi } from "../services/baseApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    myProfile: myProfileReducer,
    recentCommunities: recentCommunitiesReducer,
    testMetadata: createTestReducer,
    homeFeed: homeFeedReducer,
    testSession: testSessionSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(recentCommunitiesMiddleware),

});
