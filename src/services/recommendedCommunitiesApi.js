import { data } from "react-router-dom";
import { baseApi } from "./baseApi";

const recommendedCommunitiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecommendedCommunities: builder.query({
      query: () => "recommended/communities",
    }),
  }),
  overrideExisting: true,
});

export const { useGetRecommendedCommunitiesQuery } = recommendedCommunitiesApi;
