import { toQueryString } from "../utils/helpers";
import { baseApi } from "./baseApi";

const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserComment: builder.query({
      query: ({ username }) => ({
        url: `/users/${username}/comments`,
        method: "GET",
      }),
    }),
    getAllMyComments: builder.query({
      query: (queryParams) => ({
        url: `/comments/my${toQueryString(queryParams)}`,
        method: "GET",
      }),
    }),
    getCommentsByBoardPost: builder.query({
      query: ({ board, postId, queryParams }) => ({
        url: `/boards/${board}/posts/${postId}/comments${toQueryString(
          queryParams
        )}`,
        method: "GET",
      }),
      providesTags: (result, error, { board, postId }) => [
        { type: "Comments", id: `${board}-${postId}` },
      ],
    }),
    getCommentByBoardPostCommentId: builder.query({
      query: ({ board, post, comment }) => ({
        url: `/boards/${board}/posts/${post}/comments/${comment}`,
        method: "GET",
      }),
    }),
    createCommentByBoardPost: builder.mutation({
      query: ({ board, post, bodyData }) => ({
        url: `/boards/${board}/posts/${post}/comments`,
        method: "POST",
        body: bodyData,
      }),
      invalidatesTags: (result, error, { board, post }) => [
        { type: "Comments", id: `${board}-${post}` },
      ],
    }),
    updateCommentByBoardPost: builder.mutation({
      query: ({ board, post, comment, bodyData }) => ({
        url: `/boards/${board}/posts/${post}/comments/${comment}`,
        method: "PUT",
        body: bodyData,
      }),
      invalidatesTags: (result, error, { board, post }) => [
        { type: "Comments", id: `${board}-${post}` },
      ],
    }),
    deleteCommentByBoardPost: builder.mutation({
      query: ({ board, post, comment }) => ({
        url: `/boards/${board}/posts/${post}/comments/${comment}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { board, post }) => [
        { type: "Comments", id: `${board}-${post}` },
      ],
    }),
    getCommentsByDescTest: builder.query({
      query: ({ desc, test, queryParams }) => ({
        url: `/descs/${desc}/tests/${test}/comments${toQueryString(
          queryParams
        )}`,
        method: "GET",
      }),
      providesTags: (result, error, { desc, test }) => [
        { type: "Comments", id: `${desc}-${test}` },
      ],
    }),
    getCommentByDescTestCommentId: builder.query({
      query: ({ desc, test, comment }) => ({
        url: `/descs/${desc}/tests/${test}/comments/${comment}`,
        method: "GET",
      }),
    }),
    createCommentByDescTest: builder.mutation({
      query: ({ desc, test, bodyData }) => ({
        url: `/descs/${desc}/tests/${test}/comments`,
        method: "POST",
        body: bodyData,
      }),
      invalidatesTags: (result, error, { desc, test }) => [
        { type: "Comments", id: `${desc}-${test}` },
      ],
    }),
    updateCommentByDescTest: builder.mutation({
      query: ({ desc, test, comment, bodyData }) => ({
        url: `/descs/${desc}/tests/${test}/comments/${comment}`,
        method: "PUT",
        body: bodyData,
      }),
      invalidatesTags: (result, error, { desc, test }) => [
        { type: "Comments", id: `${desc}-${test}` },
      ],
    }),
    deleteCommentByDescTest: builder.mutation({
      query: ({ desc, test, comment }) => ({
        url: `/descs/${desc}/tests/${test}/comments/${comment}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { desc, test }) => [
        { type: "Comments", id: `${desc}-${test}` },
      ],
    }),
    getCommentLikesByCommentId: builder.query({
      query: ({ comment }) => ({
        url: `/comments/${comment}/likes`,
      }),
    }),
    toggleCommentLikeByCommentId: builder.mutation({
      query: ({ comment }) => ({
        url: `/comments/${comment}/likes`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetCommentsByBoardPostQuery,
  useGetCommentByBoardPostCommentIdQuery,
  useGetCommentsByDescTestQuery,
  useGetCommentByDescTestCommentIdQuery,
  useCreateCommentByDescTestMutation,
  useDeleteCommentByDescTestMutation,
  useUpdateCommentByDescTestMutation,
  useCreateCommentByBoardPostMutation,
  useUpdateCommentByBoardPostMutation,
  useDeleteCommentByBoardPostMutation,
  useGetUserCommentQuery,
  useGetCommentLikesByCommentIdMutation,
  useToggleCommentLikeByCommentIdMutation,
  useGetAllMyCommentsQuery,
} = commentsApi;
