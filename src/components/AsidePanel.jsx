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
import RelativeTime from "./RelativeTime";
import Announcements from "../pages/user/components/Announcements";
const CommunityElement = ({ community, subscribed, setError }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { profileData } = useSelector((state) => state.myProfile);
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
    if (profileData?.id === community.author.id) return;
    try {
      if (isBoard) {
        await subscribeToBoard({ board: communityName }).unwrap();
        subscribed.boards.add(id);
      } else {
        await subscribeToDesc({ desc: communityName }).unwrap();
        subscribed.descs.add(id);
      }
    } catch (err) {
      setError({ hasError: true, message: err.data.message });
    }
  };
  const onUnsubscribe = async (e, isBoard, communityName, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (profileData?.id === community.author.id) return;
    try {
      if (isBoard) {
        await unsubscribeFromBoard({ board: communityName }).unwrap();
        subscribed.boards.delete(id);
      } else {
        await unsubscribeFromDesc({ desc: communityName }).unwrap();
        subscribed.descs.delete(id);
      }
    } catch (err) {
      setError({ hasError: true, message: err.data.message });
    }
  };

  return (
    <div
      key={community.id}
      className={
        location.pathname === "/explore/"
          ? "flex items-start lg:flex-col lg:items-stretch gap-3 flex-1 bg-white dark:bg-neutral-900 w-full lg:min-w-[30%] lg:max-w-2/5 p-4 border border-neutral-100 dark:border-neutral-800 rounded-lg shadow"
          : "flex flex-col items-start justify-between gap-3 p-2 hover:bg-neutral-50 dark:bg-neutral-800 dark:hover:bg-neutral-900 rounded-lg transition-colors"
      }
    >
      <div className="flex-1 min-w-0">
        <Link
          to={path}
          className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-0.5"
        >
          {path}
        </Link>
        <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-1">
          {community.description}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          {community.subscribers_count > 1
            ? `${community.subscribers_count} members`
            : `${community.subscribers_count} member`}
        </p>
      </div>
      {profileData?.id !== community.author.id ? (isSubscribed ? (
        <button
          className={
            "w-full bg-white dark:bg-neutral-900 text-red-500 dark:text-neutral-100 px-2 py-1.5 rounded-full text-xs font-bold hover:bg-red-500/10 dark:hover:bg-neutral-100 dark:hover:text-neutral-900 border border-red-500 dark:border-neutral-100 transition-colors cursor-pointer flex-shrink-0 disabled:opacity-100 disabled:animate-pulse"
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
            "w-full bg-white dark:bg-neutral-100 text-primary-blue dark:text-neutral-900 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-primary-blue/10 dark:hover:bg-neutral-900 dark:hover:text-neutral-100 border border-primary-blue dark:border-neutral-100 transition-colors cursor-pointer flex-shrink-0 disabled:opacity-100 disabled:animate-pulse"
          }
          onClick={(e) => onSubscribe(e, isBoard, community.name, community.id)}
          disabled={isSubscribing}
        >
          <span>Join</span>
        </button>
      )): null}
    </div>
  );
};
const AsidePanel = () => {
  const location = useLocation();
  const [error, setError] = useState({ hasError: false, message: null });
  const {
    data: announcementsResult,
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
    <>
      <aside className="xl:h-screen xl:sticky xl:top-0 overflow-y-auto scrollbar-hide px-4 space-y-4 bg-white dark:bg-neutral-900">
        {/* Search Panel */}
        <SearchPanel className="pt-4" />
        {/* Announcements Panel */}
        <Announcements announcements={announcementsResult?.data} isExplorePage={location.pathname === "/explore/"} isLoading={isAnnouncementsFetching} isSuccess={isSuccess}/>
        {isCommunitiesFetching ? (
          <RecommendedCommunitySkeleton
            isExplorePage={location.pathname === "/explore/"}
          />
        ) : (
          <div
            className={
              location.pathname === "/explore/"
                ? ""
                : "bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-4"
            }
          >
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
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
        <ul className="flex flex-wrap text-xs text-neutral-600 dark:text-neutral-400 gap-2 mb-10">
          <li className="flex-1 min-w-fit">
            <Link
              to={"/terms"}
              className="hover:underline hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              Terms of Service
            </Link>
          </li>
          <li className="flex-1 min-w-fit">
            <Link
              to={"/terms#privacy-policy"}
              className="hover:underline hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              Privacy Policy
            </Link>
          </li>
          <li className="flex-1 min-w-fit">
            <Link
              to={"/terms#cookie-policy"}
              className="hover:underline hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              Cookie Policy
            </Link>
          </li>
          <li className="flex-1 min-w-fit">
            <Link
              to={"/terms#trademark-disclaimer"}
              className="hover:underline hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              Trademark Disclaimer
            </Link>
          </li>
          <li className="flex-1 min-w-fit">
            <Link
              to={"/terms#limitations-of-liability"}
              className="hover:underline hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              Limitations of Liability
            </Link>
          </li>
          <li className="flex-1 min-w-fit">
            © {new Date().getFullYear()} UnimeSpace
          </li>
        </ul>
      </aside>
      {error.hasError && (
        <Toast
          message={error.message}
          onClose={() => setError({ hasError: false, message: null })}
          key={"AsidePanel-error"}
          time={10000}
          type="error"
        />
      )}
    </>
  );
};

export default AsidePanel;
