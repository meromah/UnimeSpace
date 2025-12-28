import { data } from "react-router-dom";
import { baseApi } from "./baseApi";

const announcementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query({
      query: () => "announcements",
    }),
  }),
  overrideExisting: true,
});

export const { useGetAnnouncementsQuery } = announcementApi;
