import { baseApi } from "./baseApi";

const toQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) return "";
  return `?${new URLSearchParams(params).toString()}`;
};

// Auth-required endpoints
const PrivateTestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /descs/{desc}/tests (paginated)
    getTestsForDesc: builder.query({
      query: ({ desc, queryParams }) =>
        `/descs/${desc}/tests${toQueryString(queryParams)}`,
      providesTags: (result, error, { desc }) => [
        { type: "Desc", id: `tests-for-${desc}` },
      ],
    }),
    // GET /tests/my
    getAllMyTests: builder.query({
      query: (queryParams) => ({
        url: `/tests/my${toQueryString(queryParams)}`,
      }),
    }),
    getTestsByFilter: builder.query({
      query: ({ queryParams }) => `/tests${toQueryString(queryParams)}`,
      // providesTags: [{ type: "Post", id: "GlobalPostSearch" }]
      transformResponse: (response) => ({ ...response, type: "test" }),
    }),
    // GET /descs/{desc}/tests/{test}
    getTestFromDescById: builder.query({
      query: ({ desc, test }) => `/descs/${desc}/tests/${test}`,
    }),

    getTestDraftsForDesc: builder.query({
      query: ({ desc }) => `/descs/${desc}/tests/drafts`,
      providesTags: (result, error, { desc }) => [
        { type: "Desc", id: `draft-tests-${desc}` },
      ],
    }),
    getTestAllDrafts: builder.query({
      query: () => `/tests/drafts`,
      providesTags: [{ type: "Desc", id: "tests/drafts" }],
    }),
    // POST /descs/{desc}/tests
    createTest: builder.mutation({
      query: ({ desc, bodyData }) => ({
        url: `/descs/${desc}/tests`,
        method: "POST",
        body: bodyData,
      }),
      invalidatesTags: (result, error, { desc }) => [
        { type: "Desc", id: `draft-tests-${desc}` },
      ],
    }),

    // PUT /descs/{desc}/tests/{test}
    updateTest: builder.mutation({
      query: ({ desc, test, bodyData }) => ({
        url: `/descs/${desc}/tests/${test}`,
        method: "PUT",
        body: bodyData,
      }),
      invalidatesTags: (result, error, { desc }) => [
        { type: "Desc", id: `tests-for-${desc}` },
      ],
    }),

    // DELETE /descs/{desc}/tests/{test}
    deleteTest: builder.mutation({
      query: ({ desc, test }) => ({
        url: `/descs/${desc}/tests/${test}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { desc }) => [
        { type: "Desc", id: `draft-tests-${desc}` },
      ],
    }),

    // POST /descs/{desc}/tests/{test}/likes (toggle like)
    toggleTestLike: builder.mutation({
      query: ({ desc, test }) => ({
        url: `/descs/${desc}/tests/${test}/likes`,
        method: "POST",
      }),
    }),

    // POST /descs/{desc}/tests/{test}/submit
    submitTest: builder.mutation({
      query: ({ desc, test, bodyData }) => ({
        url: `/descs/${desc}/tests/${test}/submit`,
        method: "POST",
        body: bodyData,
      }),
    }),

    // GET /descs/{desc}/tests/{test}/result
    getTestResult: builder.query({
      query: ({ desc, test }) => `/descs/${desc}/tests/${test}/result`,
    }),
    getUserFollowingFeedTests: builder.query({
      query: ({queryParams}) => ({
        url: `feeds/tests${toQueryString(queryParams)}`,
      }),
    }),
  }),
  overrideExisting: true,
});

// Public endpoint for like count
const PublicTestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /descs/{desc}/tests/{test}/likes (like count)
    getTestLikes: builder.query({
      query: ({ desc, test }) => `/descs/${desc}/tests/${test}/likes`,
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetTestsForDescQuery,
  useGetAllMyTestsQuery,
  useGetUserFollowingFeedTestsQuery,
  useGetTestFromDescByIdQuery,
  useLazyGetTestFromDescByIdQuery,
  useGetTestAllDraftsQuery,
  useGetTestDraftsForDescQuery,
  useGetTestsByFilterQuery,
  useCreateTestMutation,
  useUpdateTestMutation,
  useDeleteTestMutation,
  useToggleTestLikeMutation,
  useSubmitTestMutation,
  useGetTestResultQuery,
} = PrivateTestsApi;

export const { useGetTestLikesQuery } = PublicTestsApi;
