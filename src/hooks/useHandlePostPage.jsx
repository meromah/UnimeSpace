import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useCreateCommentByBoardPostMutation,
  useGetCommentsByBoardPostQuery,
} from "../services/commentsApi";
import {
  useGetPostFromBoardByPostIdQuery,
  useTogglePostLikeMutation,
} from "../services/postsApi";
import { extractErrorMessage } from "../utils";
import { useGetTestFromDescByIdQuery, useToggleTestLikeMutation } from "../services/testsApi";

const useHandlePostPage = ({ community, itemId, itemType }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // UI state
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCommentReportModalOpen, setIsCommentReportModalOpen] =
    useState(false);
  const [isCommentDeleteModalOpen, setIsCommentDeleteModalOpen] =
    useState(false);

  const [selectedComment, setSelectedComment] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  const [toast, setToast] = useState(null);

  // Refs for updating counts without re-render
  const commentCountRef = useRef(null);
  const postLikesCountRef = useRef(null);

  // API hooks
  const [postComment, { error: postCommentError, isLoading }] =
    useCreateCommentByBoardPostMutation();

  const [togglePostLike, { error: togglePostLikeError }] =
    useTogglePostLikeMutation();
  const [toggleTestLike, { error: toggleTestLikeError }] =
    useToggleTestLikeMutation();

  const {
    data: postData,
    isLoading: isPostLoading,
    isError: isPostError,
    error: postError,
  } = useGetPostFromBoardByPostIdQuery(
    { board: community, postId: itemId },
    { skip: itemType !== "post" }
  );
  const {
    data: testData,
    isLoading: isTestLoading,
    isError: isTestError,
    error: testError,
  } = useGetTestFromDescByIdQuery(
    { desc: community, test: itemId },
    { skip: itemType !== "test" }
  );

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
  } = useGetCommentsByBoardPostQuery({
    board: community,
    postId: itemId,
  });

  // Memoized file separation
  const { images, files } = useMemo(() => {
    const list = postData?.data?.files || [];
    return {
      images: list.filter((f) => f.mimetype.startsWith("image/")),
      files: list.filter((f) => !f.mimetype.startsWith("image/")),
    };
  }, [postData?.data?.files]);

  // Sync "youLiked" state
  useEffect(() => {
    if (postData?.data) {
      setIsPostLiked(postData.data.youLiked);
    }
  }, [postData]);

  // Error toast handlers
  useEffect(() => {
    if (postCommentError) {
      setToast({
        message: extractErrorMessage(postCommentError),
        type: "error",
      });
    }
  }, [postCommentError]);

  useEffect(() => {
    if (togglePostLikeError) {
      setToast({
        message: extractErrorMessage(togglePostLikeError),
        type: "error",
      });
    }
  }, [togglePostLikeError]);

  // Handlers
  const handleCommentSubmit = async (e, parent_id, body = "", setEmpty) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate("/login");
    if (!body.trim()) return;

    try {
      await postComment({
        board: community,
        post: itemId,
        bodyData: { parent_id, body },
      }).unwrap();

      if (commentCountRef.current) {
        commentCountRef.current.textContent =
          Number(commentCountRef.current.textContent) + 1;
      }

      setEmpty("");
      setActiveReplyId(null);
    } catch {}
  };

  const onTogglePostLike = async () => {
    if (!isAuthenticated) return navigate("/login");

    try {
      const toggleLike = itemType === "post"? togglePostLike: toggleTestLike
      const communityType = itemType === "post"? "board" : "desc"
      const res = await toggleLike ({
        [communityType]: community,
        [itemType]: itemId,
      }).unwrap();
      console.log(res)
      setIsPostLiked(res.toggle);

      if (postLikesCountRef.current) {
        postLikesCountRef.current.textContent = res.toggle
          ? Number(postLikesCountRef.current.textContent) + 1
          : Number(postLikesCountRef.current.textContent) - 1;
      }
    } catch {}
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleReport = (e) => {
    e.stopPropagation();
    setIsReportModalOpen(true);
  };

  const handleCommentEdit = (commentId) => {
    setSelectedCommentId(commentId);
  };

  const handleCommentDelete = (commentId) => {
    setSelectedCommentId(commentId);
    setIsCommentDeleteModalOpen(true);
  };

  const handleCommentReport = (comment) => {
    setSelectedComment(comment);
    setIsCommentReportModalOpen(true);
  };

  const handleCommentDeleteSuccess = () => {
    if (commentCountRef.current) {
      commentCountRef.current.textContent = Math.max(
        0,
        Number(commentCountRef.current.textContent) - 1
      );
    }
    setIsCommentDeleteModalOpen(false);
    setSelectedCommentId(null);
  };

  const handleCommentError = (message) => {
    setToast({ message, type: "error" });
  };

  return {
    // main data
    itemData: itemType === "post" ? postData : testData,
    commentsData,
    images,
    files,

    // status
    isItemLoading: itemType === "post" ? isPostLoading : isTestLoading,
    isCommentsLoading,
    isItemError: itemType === "post" ? isPostError : isTestError,
    isCommentsError,
    itemError: itemType === "post" ? postError : testError,
    commentsError,

    // likes
    isPostLiked,
    postLikesCountRef,
    onTogglePostLike,

    // comment submit
    handleCommentSubmit,
    isLoading,
    commentCountRef,

    // UI states
    activeReplyId,
    setActiveReplyId,

    isShareModalOpen,
    setIsShareModalOpen,

    isEditModalOpen,
    setIsEditModalOpen,

    isReportModalOpen,
    setIsReportModalOpen,

    isDeleteModalOpen,
    setIsDeleteModalOpen,

    isCommentReportModalOpen,
    setIsCommentReportModalOpen,

    isCommentDeleteModalOpen,
    setIsCommentDeleteModalOpen,

    selectedComment,
    selectedCommentId,

    // handlers
    handleEdit,
    handleDelete,
    handleReport,
    handleCommentEdit,
    handleCommentDelete,
    handleCommentReport,
    handleCommentError,
    handleCommentDeleteSuccess,

    // toast
    toast,
    setToast,
  };
};

export default useHandlePostPage;
