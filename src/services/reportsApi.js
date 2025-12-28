import { data } from "react-router-dom";
import { baseApi } from "./baseApi";

const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    makeReport: builder.mutation({
      query: ({body})=>({
        url:"reports",
        method: "POST",
        body
      })
    })
  }),
  overrideExisting: true,
});

export const { useMakeReportMutation } = reportsApi;
