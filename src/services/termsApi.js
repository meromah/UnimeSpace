import { data } from "react-router-dom";
import { baseApi } from "./baseApi";

const termsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTerms: builder.query({
      query: () => "terms",
      url: "/terms.html",
      responseHandler: "text",
    }),
  }),
  overrideExisting: true,
});

export const { useGetTermsQuery } = termsApi;
