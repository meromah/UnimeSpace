import { data } from "react-router-dom";
import { baseApi } from "./baseApi";

const errorLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitErrorLog: builder.mutation({
      query: ({log})=>({
        url: "reports/errors",
        method: "POST",
        body: {log}
      })
    })
  }),
  overrideExisting: true,
});

export const { useSubmitErrorLogMutation } = errorLogApi;
