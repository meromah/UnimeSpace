import SearchPanel from "./SearchPanel";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetAnnouncementsQuery } from "../services/announcementApi";
import { useGetRecommendedCommunitiesQuery } from "../services/recommendedCommunitiesApi";
import { useSelector } from "react-redux";
import {
  useSubscribeToBoardMutation,
  useUnsubscribeFromBoardMutation,
} from "../services/boardSubscriptionsApi";
import {
  useSubscribeToDescMutation,
  useUnsubscribeFromDescMutation,
} from "../services/descSubscriptionsApi";
import { useMemo, useState } from "react";
import RecommendedCommunitySkeleton from "../pages/user/components/Skeleton/RecommendedCommunitySkeleton";
import { AnnouncementsSkeleton } from "../pages/user/components/Skeleton/AnnouncementsSkeleton";
import Toast from "./Toast";
const CommunityElement = ({ community, subscribed, setError }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [subscribeToBoard, { isLoading: isBoardSubscribing }] =
    useSubscribeToBoardMutation();
  const [subscribeToDesc, { isLoading: isDescSubscribing }] =
    useSubscribeToDescMutation();
  const [
    unsubscribeFromBoard,
    { isLoading: isBoardUnsubscribing, error: unsubscribeBoardError },
  ] = useUnsubscribeFromBoardMutation();
  const [
    unsubscribeFromDesc,
    { isLoading: isDescUnsubscribing, error: unsubscribeDescError },
  ] = useUnsubscribeFromDescMutation();
  const isBoard = Object.hasOwn(community, "posts_count");
  const path = isBoard ? `b/${community.name}` : `d/${community.name}`;
  const communityType = isBoard ? "boards" : "descs";
  const isSubscribed = subscribed[communityType].has(community.id);
  const isSubscribing = isBoard ? isBoardSubscribing : isDescSubscribing;
  const isUnsubscribing = isBoard ? isBoardUnsubscribing : isDescUnsubscribing;
  const location = useLocation();

  const onSubscribe = async (e, isBoard, communityName, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      if (isBoard) {
        await subscribeToBoard({ board: communityName }).unwrap();
        subscribed.boards.add(id);
      } else {
        await subscribeToDesc({ desc: communityName }).unwrap();
        subscribed.descs.add(id);
      }
    } catch (err) {
      setError({hasError: true, message: err.data.message})
    }
  };
  const onUnsubscribe = async (e, isBoard, communityName, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      if (isBoard) {
        await unsubscribeFromBoard({ board: communityName }).unwrap();
        subscribed.boards.delete(id);
      } else {
        await unsubscribeFromDesc({ desc: communityName }).unwrap();
        subscribed.descs.delete(id);
      }
    } catch (err) {
      setError({hasError: true, message: err.data.message})
    }
  };

  return (
    <div
      key={community.id}
      className={
        location.pathname === "/explore/"
          ? "flex flex-col sm:flex-row sm:items-start lg:flex-col lg:items-stretch gap-3 flex-1 bg-white w-full lg:min-w-[30%] lg:max-w-2/5 p-4 border  border-neutral-100  rounded-lg shadow"
          : "flex items-start justify-between gap-3 p-2 hover:bg-neutral-50 rounded-lg transition-colors"
      }
    >
      <div className="flex-1 min-w-0">
        <Link to={path} className="text-sm font-medium text-neutral-900 mb-0.5">
          {path}
        </Link>
        <p className="text-xs text-neutral-600 line-clamp-1">
          {community.description}
        </p>
        <p className="text-xs text-neutral-500 mt-1">
          {community.subscribers_count > 1
            ? `${community.subscribers_count} members`
            : `${community.subscribers_count} member`}
        </p>
      </div>
      {isSubscribed ? (
        <button
          className={
            "bg-white text-red-500 px-2 py-1.5 rounded-full text-xs font-bold hover:bg-red-500/10 border border-red-500 transition-colors cursor-pointer flex-shrink-0 disabled:opacity-100 disabled:animate-pulse"
          }
          onClick={(e) =>
            onUnsubscribe(e, isBoard, community.name, community.id)
          }
          disabled={isUnsubscribing}
        >
          <span>Joined</span>
        </button>
      ) : (
        <button
          className={
            "bg-white text-primary-blue px-4 py-1.5 rounded-full text-xs font-bold hover:bg-primary-blue/10 border border-primary-blue transition-colors cursor-pointer flex-shrink-0 disabled:opacity-100 disabled:animate-pulse"
          }
          onClick={(e) => onSubscribe(e, isBoard, community.name, community.id)}
          disabled={isSubscribing}
        >
          <span>Join</span>
        </button>
      )}
    </div>
  );
};
const AsidePanel = () => {
  const location = useLocation();
  const [error, setError] = useState({ hasError: false, message: null });
  const {
    data: announcements,
    isSuccess,
    isFetching: isAnnouncementsFetching,
  } = useGetAnnouncementsQuery();
  const { data: communities, isFetching: isCommunitiesFetching } =
    useGetRecommendedCommunitiesQuery();
  const subscribed = useMemo(
    () => ({
      boards: new Set(communities?.subscribed.boards ?? []),
      descs: new Set(communities?.subscribed.descs ?? []),
    }),
    [communities]
  );

  return (
    <aside className="xl:h-screen xl:sticky xl:top-0 overflow-y-auto scrollbar-hide px-4 space-y-4">
      {/* Search Panel */}
      <SearchPanel className="pt-4" />

      {/* Announcements Panel */}
      {isAnnouncementsFetching ? (
        <AnnouncementsSkeleton
          isExplorePage={location.pathname === "/explore/"}
        />
      ) : (
        <div
          className={
            location.pathname === "/explore/"
              ? ""
              : "bg-white rounded-lg shadow-sm border border-neutral-200 p-4"
          }
        >
          <h2 className="text-sm font-semibold text-neutral-900 mb-3">
            Announcements
          </h2>
          <div
            className={
              location.pathname === "/explore/"
                ? "flex flex-col gap-2 p-4 text-lg"
                : "space-y-4"
            }
          >
            {isSuccess &&
              announcements?.data?.map((announcement) => (
                <div
                  key={announcement.id}
                  className={
                    location.pathname === "/explore/"
                      ? "bg-white w-full p-4 border  border-neutral-100  rounded-lg shadow"
                      : "pb-4 border-b border-neutral-100 last:border-b-0 last:pb-0"
                  }
                >
                  <h3 className="text-base font-medium text-neutral-900 mb-1">
                    {announcement.title}
                  </h3>
                  <p className="text-sm text-neutral-500">
                    {announcement.created_at}
                  </p>
                  <p className="text-sm text-neutral-600 mb-2">
                    {announcement.body}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {isCommunitiesFetching ? (
        <RecommendedCommunitySkeleton
          isExplorePage={location.pathname === "/explore/"}
        />
      ) : (
        <div
          className={
            location.pathname === "/explore/"
              ? ""
              : "bg-white rounded-lg shadow-sm border border-neutral-200 p-4"
          }
        >
          <h2 className="text-sm font-semibold text-neutral-900 mb-3">
            Recommended Communities
          </h2>
          <div
            className={
              location.pathname === "/explore/"
                ? "flex flex-col lg:flex-row items-center gap-2 p-4 overflow-x-scroll"
                : "space-y-3"
            }
          >
            {communities?.data.map((community) => (
              <CommunityElement
                community={community}
                subscribed={subscribed}
                key={community.name}
                setError={setError}
              />
            ))}
          </div>
        </div>
      )}
      <ul className="flex flex-wrap text-xs text-neutral-600 gap-2 mb-10">
        <li className="flex-1 min-w-fit">
          <Link
            to={"/terms"}
            className="hover:underline hover:text-neutral-800"
          >
            Terms of Service
          </Link>
        </li>

        <li className="flex-1 min-w-fit">
          <Link
            to={"/terms#privacy-policy"}
            className="hover:underline hover:text-neutral-800"
          >
            Privacy Policy
          </Link>
        </li>

        <li className="flex-1 min-w-fit">
          <Link
            to={"/terms#cookie-policy"}
            className="hover:underline hover:text-neutral-800"
          >
            Cookie Policy
          </Link>
        </li>

        <li className="flex-1 min-w-fit">
          <Link
            to={"/terms#trademark-disclaimer"}
            className="hover:underline hover:text-neutral-800"
          >
            Trademark Disclaimer
          </Link>
        </li>

        <li className="flex-1 min-w-fit">
          <Link
            to={"/terms#limitations-of-liability"}
            className="hover:underline hover:text-neutral-800"
          >
            Limitations of Liability
          </Link>
        </li>

        <li className="flex-1 min-w-fit">
          © {new Date().getFullYear()} UnimeSpace
        </li>
      </ul>
      {error.hasError && (
        <Toast
          message={error.message}
          onClose={() => setError({ hasError: false, message: null })}
          key={"AsidePanel-error"}
          time={10000}
          type="error"
        />
      )}
    </aside>
  );
};

export default AsidePanel;
