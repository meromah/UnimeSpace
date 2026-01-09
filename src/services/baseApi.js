import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// base api - uses HTTP-only cookies for authentication
const baseBaseQuery = fetchBaseQuery({
  baseUrl: `${VITE_API_BASE_URL}/api`,
  credentials: 'include', // Include cookies (HTTP-only) in every request
});

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseBaseQuery,
  tagTypes: ['Comments', 'Post', 'isAuthenticated', 'boardPosts', 'Board', 'Desc','Profile', 'Test'], 
  endpoints: () => ({}),
});
