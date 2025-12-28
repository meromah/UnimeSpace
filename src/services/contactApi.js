import { baseApi } from "./baseApi";

const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    contactUs: builder.mutation({
      query: ({ data }) => ({
        url: "contacts",
        method: "POST",
        body: data
      }),
    }),
  }),
  overrideExisting: true,
});

export const {useContactUsMutation} = contactApi;
