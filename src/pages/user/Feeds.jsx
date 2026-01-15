import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Inbox } from "lucide-react";
import ErrorDisplay from "../../components/ErrorDisplay.jsx";
import NotFound from "../../components/NotFound.jsx";
import { useDispatch, useSelector } from "react-redux";
import useSortBy from "../../hooks/useSortBy.jsx";
import HomeHeader from "./components/home/HomeHeader.jsx";
import HomeSortBy from "./components/home/HomeSortBy.jsx";
import { SORT_BY, SORT_BY_TYPE } from "../../utils/constants.js";
import useGetHomeData from "../../hooks/useGetHomeData.jsx";
import { TabFilters } from "../../utils/tabFilters.js";
import Toast from "../../components/Toast.jsx";
import InfiniteItemCards from "./components/Virtualized/InfiniteItemCards.jsx";
import FeedsSkeleton from "./components/Skeleton/FeedsSkeleton.jsx";
import LoginWarning from "../../components/LoginWarning.jsx";
import { setHasFetchRequest } from "../../app/homeFeedSlice.js";
import CreateCTASection from "./components/home/CreateCTASection.jsx";
import { useGetAnnouncementsQuery } from "../../services/announcementApi.js";
import Announcements from "./components/Announcements.jsx";

const tabFilters = new TabFilters();
const firstTab = tabFilters.firstValue();
const secondTab = tabFilters.secondValue();
const Feeds = () => {
  const [tab, setTab] = useState(firstTab);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const dispatch = useDispatch();
  const { profileData } = useSelector((state) => state.myProfile);
  const { hasFetchRequest } = useSelector((s) => s.homeFeed);

  const hasFetchRequestRef = useRef(hasFetchRequest);
  const username = useMemo(() => profileData?.username || null, [profileData]);
  const { isAuthenticated } = useSelector((state) => state.auth);
  // Custom hook for sorting
  const {
    sortBy: sortByType,
    label: labelByType,
    SortByComponent: SortByTypeComponent,
    emptyStateMessages: emptyStateMessagesByType,
    resetSortBy: resetSortByType,
  } = useSortBy({ isAuthenticated, sortOptionsConfig: SORT_BY_TYPE });
  const {
    sortBy,
    label: labelByTime,
    SortByComponent: SortByTimeComponent,
    emptyStateMessages: emptyStateMessagesByTime,
    resetSortBy,
  } = useSortBy({ isAuthenticated, sortOptionsConfig: SORT_BY });
  //API call hook to get posts/tests details
  const { data, likedData, error, hasMore } = useGetHomeData({
    sortBy,
    sortByType,
    tab,
    username,
  });

  const {
    data: announcementsResult,
    isSuccess: isAnnouncementsSuccess,
    isFetching: isAnnouncementsFetching,
  } = useGetAnnouncementsQuery();

  const handleTabChange = (newTab) => {
    setTab(newTab);
  };

  useEffect(() => {
    hasFetchRequestRef.current = hasFetchRequest;
  }, [hasFetchRequest]);
  useEffect(() => {
    resetSortBy();
    resetSortByType();
  }, [tab]);
  useEffect(() => {
    if (isFirstLoading && data && data.length > 0) {
      setIsFirstLoading(false);
    }
  }, [data, isFirstLoading]);
  const fetchRequest = useCallback(() => {
    if (!hasFetchRequestRef.current[tab]) {
      dispatch(setHasFetchRequest({ state: true, tab }));
    }
  }, [dispatch]);

  return (
    <>
      <div>
        <div>
          {/* Content */}
          {isFirstLoading ? (
            <FeedsSkeleton />
          ) : data.length === 0 ? (
            <>
              <HomeHeader tab={tab} onTabChange={handleTabChange} />

              {tab === firstTab && (
                <>
                  <HomeSortBy
                    SortByTimeComponent={SortByTimeComponent}
                    SortByTypeComponent={SortByTypeComponent}
                    labelByTime={labelByTime}
                    labelByType={labelByType}
                    className="p-4 md:p-6"
                  />
                  <CreateCTASection />
                  <div className="sm:hidden virtual-item-margin-x" ref={ref}>
                    <Announcements
                      announcements={announcementsResult?.data}
                      isExplorePage={true}
                      isLoading={isAnnouncementsFetching}
                      isSuccess={isAnnouncementsSuccess}
                      className="flex gap-4 overflow-x-auto"
                    />
                  </div>
                </>
              )}
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full p-6 mb-4">
                  <Inbox className="text-4xl text-neutral-400 dark:text-neutral-500" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  No posts yet. Be a first one to post
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm text-center max-w-sm">
                  {tab === "following"
                    ? "No posts from your boards. Check other filters."
                    : "Be the first to post something!"}
                </p>
              </div>
            </>
          ) : (
            <>
              {tab === firstTab ? (
                <InfiniteItemCards
                  key={tab}
                  hasMore={hasMore}
                  items={data}
                  likedData={likedData}
                  tab={tab}
                  error={error[firstTab]}
                  layoutVersion={`${tab}-${sortByType}-${sortBy}`}
                  layoutSchemaVersion={"feeds-itemCards"}
                  headerElements={[
                    (ref) => (
                      <HomeHeader
                        ref={ref}
                        tab={tab}
                        onTabChange={handleTabChange}
                      />
                    ),
                    (ref) => (
                      <HomeSortBy
                        ref={ref}
                        SortByTimeComponent={SortByTimeComponent}
                        SortByTypeComponent={SortByTypeComponent}
                        labelByTime={labelByTime}
                        labelByType={labelByType}
                        className="virtual-item-padding-x"
                      />
                    ),
                    (ref) => <CreateCTASection ref={ref} />,
                    (ref) => (
                      <div
                        className="sm:hidden virtual-item-margin-x"
                        ref={ref}
                      >
                        <Announcements
                          announcements={announcementsResult?.data}
                          isExplorePage={true}
                          isLoading={isAnnouncementsFetching}
                          isSuccess={isAnnouncementsSuccess}
                          className="flex gap-4 overflow-x-auto"
                        />
                      </div>
                    ),
                  ]}
                  onNearBottom={fetchRequest}
                />
              ) : tab === secondTab ? (
                <InfiniteItemCards
                  key={tab}
                  hasMore={hasMore}
                  items={data}
                  likedData={likedData}
                  tab={tab}
                  error={error[secondTab]}
                  layoutVersion={`${tab}-${sortByType}-${sortBy}`}
                  layoutSchemaVersion={"feeds-itemCards"}
                  headerElements={[
                    (ref) => (
                      <HomeHeader
                        ref={ref}
                        tab={tab}
                        onTabChange={handleTabChange}
                      />
                    ),
                    (ref) => (
                      <div ref={ref}>
                        {error[secondTab].hasError &&
                        error[secondTab].status === 401 ? (
                          <LoginWarning message="You need to log in to see this page." />
                        ) : null}
                        {error[secondTab].hasError &&
                        error[secondTab].status === 404 ? (
                          <NotFound />
                        ) : error[secondTab].hasError &&
                          error[secondTab].status !== 401 ? (
                          <ErrorDisplay error={error[secondTab]} />
                        ) : null}
                      </div>
                    ),
                  ]}
                  onNearBottom={fetchRequest}
                />
              ) : null}
            </>
          )}
        </div>
      </div>
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default Feeds;
