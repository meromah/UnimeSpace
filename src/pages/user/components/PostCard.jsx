import React, { useRef, useState, useMemo } from "react";
import { MessageCircle, Heart, Share2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTogglePostLikeMutation } from "../../../services/postsApi";
import { useDispatch, useSelector } from "react-redux";
import RelativeTime from "../../../components/RelativeTime";
import { getFileUrl, getInitials } from "../../../utils";
import PostImages from "./PostImages";
import PostFiles from "./PostFiles";
import ShareModal from "./ShareModal";
import PostMenu from "./PostMenu";
import EditPostModal from "./EditPostModal";
import ReportModal from "./ReportModal";
import DeletePostModal from "./DeletePostModal";
import { useToggleTestLikeMutation } from "../../../services/testsApi";
import { resetSession } from "../../../app/testSessionSlice";
const preventNavigation = (e) => {
  e.preventDefault();
  e.stopPropagation();
};
const PostCard = ({
  item,
  isFirst,
  isLast,
  itemType = "post",
  communityType = "board",
  communityUrl = "b/",
  onError,
  isLiked = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [liked, setLiked] = useState(isLiked);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const postLikesCountRef = useRef(null);
  const [togglePostLike, { isLoading: isTogglePostLikeLoading }] =
    useTogglePostLikeMutation();
  const [toggleTestLike, { isLoading: isToggleTestLikeLoading }] =
    useToggleTestLikeMutation();
  const isLoading = isTogglePostLikeLoading || isToggleTestLikeLoading;
  // Separate images and files based on mimetype
  const { images, files } = useMemo(() => {
    if (!item.files || item.files.length === 0) {
      return { images: [], files: [] };
    }
    const imageFiles = item.files.filter((file) =>
      file.mimetype.startsWith("image/")
    );
    const nonImageFiles = item.files.filter(
      (file) => !file.mimetype.startsWith("image/")
    );
    return { images: imageFiles, files: nonImageFiles };
  }, [item.files]);

  const handleAuthorClick = (e, path) => {
    preventNavigation(e);
    //later i will implement the logic to determine if the path is for UserProfile or MyProfile.
    //for now, i will just navigate to the UserProfile page.
    navigate(path);
  };

  const handleBoardClick = (e, path) => {
    preventNavigation(e);
    navigate(path);
  };

  const onTogglePostLike = async (e) => {
    preventNavigation(e);
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if(isLoading) return
    try {
      const community = item[communityType].name;
      const itemId = item.id;
      const toggleLike = itemType === "test" ? toggleTestLike : togglePostLike;
      setLiked((prev) => !prev);
      const res = await toggleLike({
        [communityType]: community,
        [itemType]: itemId,
      }).unwrap();
      postLikesCountRef.current.textContent = res.toggle
        ? Number(postLikesCountRef.current.textContent) + 1
        : Number(postLikesCountRef.current.textContent) - 1;
    } catch (err) {
      onError({ message: err.data.message });
      setLiked((prev) => !prev);
    }
  };

  const handleEdit = (e) => {
    preventNavigation(e);
    setIsEditModalOpen(true);
  };

  const handleDelete = (e) => {
    preventNavigation(e);
    setIsDeleteModalOpen(true);
  };

  const handleReport = (e) => {
    preventNavigation(e);
    setIsReportModalOpen(true);
  };
  const onStartTest = (e) => {
    preventNavigation(e);
    dispatch(resetSession())
    navigate(
      `/${communityUrl}${item[communityType].name}/${itemType}s/${item.id}/start`
    );
  };
  return (
    <>
      <Link
        to={`/${communityUrl}${item[communityType].name}/${itemType}/${item.id}`}
        className={`block bg-white border-x border-b border-gray-200 p-4 hover:bg-primary-bg transition-colors duration-200 ${
          isFirst ? "rounded-t-lg border-t" : isLast ? "rounded-b-lg" : ""
        }`}
      >
        {/* Header */}
        <div className="relative flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <button
              onClick={(e) =>
                item.author &&
                handleAuthorClick(e, `/user/${item.author.username}`)
              }
              className="w-10 h-10 rounded-full overflow-hidden shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              {item?.author?.avatar ? (
                <img
                  src={getFileUrl(item.author.avatar.file_hash)}
                  alt={`${item.author.username}'s profile picture`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="flex items-center justify-center bg-blue-500 text-white text-xs font-semibold w-full h-full">
                  {item.author ? getInitials(item.author.username) : ""}
                </span>
              )}
            </button>

            {/* User + Community */}
            <div className="max-w-52 sm:max-w-full flex flex-col gap-0.5">
              <button
                className="w-full text-primary-blue text-base text-start cursor-pointer hover:underline truncate focus:outline-none"
                onClick={(e) =>
                  handleBoardClick(
                    e,
                    `/${communityUrl}${item[communityType].name}`
                  )
                }
              >
                {communityUrl + item[communityType].name}
              </button>

              <p className="text-xs text-neutral-600 flex items-center gap-1">
                {item?.author ? (
                  <button
                    onClick={(e) =>
                      handleAuthorClick(e, `/user/${item.author.username}`)
                    }
                    className="cursor-pointer hover:underline focus:outline-none"
                  >
                    u/{item.author.username}
                  </button>
                ) : (
                  <span>[deleted]</span>
                )}
                <RelativeTime
                  date={item.created_at}
                  className="text-neutral-500"
                />
              </p>
            </div>
          </div>

          {/* Post Menu */}
          <div className="absolute top-0 right-0" onClick={preventNavigation}>
            <PostMenu
              itemType={itemType}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReport={handleReport}
            />
          </div>
        </div>

        {/* Content */}
        {itemType === "test" ? (
          <div className="group mb-3 flex justify-between items-center gap-4 border-l-4 border-blue-500 bg-blue-50 p-3 rounded hover:bg-blue-100 transition-colors duration-200">
            <div className="flex-1 overflow-hidden flex flex-col gap-0.5">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-neutral-600 truncate">{item.body}</p>
            </div>
            <button
              className="px-4 py-2 rounded bg-primary-blue text-white text-sm hover:bg-primary-blue/90 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              onClick={onStartTest}
            >
              Start
            </button>
          </div>
        ) : (
          <div className="mb-3 flex flex-col gap-2">
            <div>
              <p className="font-medium mb-1">{item.title}</p>
              <p className="text-sm text-neutral-600">{item.body}</p>
            </div>

            {images.length > 0 && <PostImages images={images} />}
            {files.length > 0 && <PostFiles files={files} />}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 text-neutral-600 text-sm">
          <button
            className="flex items-center gap-2 hover:text-neutral-900 p-2 -m-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/40"
            title="Comments"
            aria-label={`${item.comments_count} comments`}
          >
            <MessageCircle  size={18} /> {item.comments_count}
          </button>

          <button
            onClick={onTogglePostLike}
            className={`${
              isLoading ? "animate-pulse" : ""
            } flex items-center gap-2 hover:text-neutral-900 p-2 -m-2 rounded transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/40 cursor-pointer`}
            aria-label={`${item.likes_count} likes. ${
              liked ? "Unlike" : "Like"
            } this item`}
            title={liked ? "Unlike" : "Like"}
          >
            <Heart  size={18} className={liked ? "text-red-500 fill-red-500" : ""} />
            <span
              ref={postLikesCountRef}
              className={liked ? "text-red-500" : ""}
            >
              {item.likes_count}
            </span>
          </button>

          <button
            className="flex items-center gap-2 hover:text-neutral-900 p-2 -m-2 rounded transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/40"
            title="Share"
            onClick={(e) => {
              preventNavigation(e);
              setIsShareModalOpen(true);
            }}
          >
            <Share2 size={18}/>
          </button>
        </div>
      </Link>

      {/* Modals */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        itemUrl={`${window.location.origin}/b/${item[communityType].name}/${itemType}/${item.id}`}
        itemTitle={item.title}
      />

      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        post={item}
        boardName={item[communityType].name}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        item={item}
        itemType={itemType}
      />

      <DeletePostModal
        communityType={communityType}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        communityName={item[communityType].name}
        itemId={item.id}
      />
    </>
  );
};

export default React.memo(PostCard);
