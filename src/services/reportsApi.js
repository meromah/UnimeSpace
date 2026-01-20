import { baseApi } from "./baseApi";
import { toQueryString } from "../utils/helpers";

const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    makeReport: builder.mutation({
      query: ({ body }) => ({
        url: "reports",
        method: "POST",
        body,
      }),
    }),
    getReports: builder.query({
      query: (queryParams) => ({
        url: `reports${toQueryString(queryParams)}`,
      }),
    }),
    getReportById: builder.query({
      query: ({ id }) => ({
        url: `reports/${id}`,
      }),
    }),
    deleteReport: builder.mutation({
      query: ({ id }) => ({
        url: `reports/${id}`,
        method: "DELETE",
      }),
    }),
    updateReport: builder.mutation({
      query: ({ id, body }) => ({
        url: `reports/${id}`,
        method: "PUT",
        body,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useMakeReportMutation,
  useGetReportsQuery,
  useGetReportByIdQuery,
  useDeleteReportMutation,
  useUpdateReportMutation
} = reportsApi;
