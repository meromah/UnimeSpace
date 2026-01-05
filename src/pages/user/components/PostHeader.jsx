import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RelativeTime from "../../../components/RelativeTime";
import { getFileUrl, getInitials } from "../../../utils";
import PostMenu from "./PostMenu";
import { useMemo } from "react";

const PostHeader = ({ itemData, onEdit, onDelete, onReport, communityUrl, community }) => {
  const navigate = useNavigate();
  const handleAuthorClick = (e, path) => {
    e.stopPropagation();
    navigate(path);
  };

  const handleBoardClick = (e, path) => {
    e.stopPropagation();
    navigate(path);
  };
  return (
    <div className="px-4 border-b border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center justify-between gap-2 py-4">
        <div className="flex items-center gap-2">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors font-medium cursor-pointer"
          >
            <ChevronLeft className="text-2xl" />
          </button>
          {/* Author */}
          <div className="flex items-center gap-3">
            <div
              className="rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-shadow cursor-pointer ring-2 ring-white dark:ring-neutral-900"
              onClick={(e) =>
                itemData?.data?.author && handleAuthorClick(e, `/user/${itemData.data.author.username}`)
              }
            >
              {itemData?.data?.author?.avatar ? (
                <img
                  src={getFileUrl(itemData?.data?.author?.avatar)}
                  alt="Board avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="w-11 h-11 flex items-center justify-center rounded-full">
                  {itemData?.data?.author? getInitials(itemData.data.author.username):""}
                </p>
              )}
            </div>
            <div>
              <p
                className="w-full text-primary-blue dark:text-neutral-200 dark:font-semibold text-base cursor-pointer hover:underline truncate font-medium"
                role="button"
                tabIndex={0}
                onClick={(e) =>
                  handleBoardClick(
                    e,
                    `/${communityUrl}${itemData.data[community].name}`
                  )
                }
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  handleBoardClick(
                    e,
                    `/${communityUrl}${itemData.data[community].name}`
                  )
                }
              >
                {communityUrl}
                {itemData.data[community].name}
              </p>
              <p className="text-[12px] flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                {itemData?.data?.author?<span
                  onClick={(e) =>
                    handleAuthorClick(
                      e,
                      `/user/${itemData.data.author.username}`
                    )
                  }
                  className="cursor-pointer hover:underline"
                  role="link"
                  tabIndex={0}
                >
                  u/{itemData.data.author.username}
                </span>:
                <span
                >
                  [deleted]
                </span>}
                <RelativeTime
                  date={itemData.data.created_at}
                  className="flex items-center text-neutral-700 dark:text-neutral-400 ml-1 "
                />
              </p>
            </div>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <PostMenu
            item={itemData.data}
            onEdit={onEdit}
            onDelete={onDelete}
            onReport={onReport}
          />
        </div>
      </div>
    </div>
  );
};

export default PostHeader;

