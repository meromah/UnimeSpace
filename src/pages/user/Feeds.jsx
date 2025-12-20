import { useState, useEffect, useMemo, useLayoutEffect, useRef } from "react";
import { FaInbox } from "react-icons/fa";
import ErrorDisplay from "../../components/ErrorDisplay.jsx";
import NotFound from "../../components/NotFound.jsx";
import { useSelector } from "react-redux";
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
const tabFilters = new TabFilters();
const firstTab = tabFilters.firstValue();
const secondTab = tabFilters.secondValue();
const Feeds = () => {
  const [tab, setTab] = useState(firstTab);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { profileData } = useSelector((state) => state.myProfile);
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
  //API call hook
  const { data, likedData, error, hasMore } = useGetHomeData({
    sortBy,
    sortByType,
    tab,
    username,
  });
  const handleTabChange = (newTab) => {
    setTab(newTab);
  };
  useEffect(() => {
    resetSortBy();
    resetSortByType();
  }, [tab]);
  useEffect(() => {
    if (isFirstLoading && data && data.length > 0) {
      setIsFirstLoading(false);
    }
  }, [data, isFirstLoading]);
  return (
    <>
      <div>
        {/* Filter bar */}
        <div className="relative">
          {/* Content */}
          {isFirstLoading ? (
            <FeedsSkeleton />
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
                        className="virtual-item-padding"
                      />
                    ),
                  ]}
                />
              ) : tab === secondTab ? (
                <InfiniteItemCards
                  key={tab}
                  hasMore={hasMore}
                  items={data}
                  likedData={likedData}
                  tab={tab}
                  error={error[secondTab]}
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
                />
              ) : (
                <>
                  <HomeHeader tab={tab} onTabChange={handleTabChange} />

                  <HomeSortBy
                    SortByTimeComponent={SortByTimeComponent}
                    SortByTypeComponent={SortByTypeComponent}
                    labelByTime={labelByTime}
                    labelByType={labelByType}
                    className="p-4 md:p-6"
                  />
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="bg-neutral-100 rounded-full p-6 mb-4">
                      <FaInbox className="text-4xl text-neutral-400" />
                    </div>
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">
                      No posts yet. Be a first one to post
                    </h3>
                    <p className="text-neutral-600 text-sm text-center max-w-sm">
                      {tab === "following"
                        ? "No posts from your boards. Check other filters."
                        : "Be the first to post something!"}
                    </p>
                  </div>
                </>
              )}
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
