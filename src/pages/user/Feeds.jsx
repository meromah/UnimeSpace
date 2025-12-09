import { useState, useEffect, useMemo } from "react";
import PostCard from "./components/PostCard";
import { FaInbox } from "react-icons/fa";
import Loading from "../../components/Loading.jsx";
import ErrorDisplay from "../../components/ErrorDisplay.jsx";
import { useSelector } from "react-redux";
import useSortBy from "../../hooks/useSortBy.jsx";
import HomeHeader from "./components/home/HomeHeader.jsx";
import HomeSortBy from "./components/home/HomeSortBy.jsx";
import { SORT_BY, SORT_BY_TYPE } from "../../utils/constants.js";
import useGetHomeData from "../../hooks/useGetHomeData.jsx";
import { TabFilters } from "../../utils/tabFilters.js";
import Toast from "../../components/Toast.jsx";

const Feeds = () => {
  const [tab, setTab] = useState(() => {
    const tabs = new TabFilters();
    return tabs.firstValue();
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
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
  const { data, isLoading, error } = useGetHomeData({
    sortBy,
    sortByType,
    tab,
    username,
  });
  const handleTabChange = (newTab) => {
    setIsTransitioning(true);
    setTab(newTab);
    setTimeout(() => setIsTransitioning(false), 150);
  };
  useEffect(() => {
    resetSortBy();
    resetSortByType();
  }, [tab]);

  return (
    <>
      <div className="grid gap-4">
        {/* Filter bar */}
        <HomeHeader tab={tab} onTabChange={handleTabChange} />
        <div className="px-4 md:px-6">
          <HomeSortBy
            SortByTimeComponent={SortByTimeComponent}
            SortByTypeComponent={SortByTypeComponent}
            labelByTime={labelByTime}
            labelByType={labelByType}
          />
          {/* Content */}
          {isLoading ? (
            <Loading />
          ) : error.hasError ? (
            <ErrorDisplay error={error.status} title={error.message} />
          ) : (
            <div
              className={`transition-opacity duration-150 ${
                isTransitioning ? "opacity-40" : "opacity-100"
              }`}
              role="region"
              aria-live="polite"
              aria-label="Feed posts"
            >
              {data !== null && data.length > 0 ? (
                <div className="">
                  {data.map((item, index) => (
                    <PostCard
                      key={item.id}
                      item={item}
                      isFirst={index === 0}
                      isLast={index === data.length - 1}
                      itemType={item["board_id"] ? "post" : "test"}
                      communityType={item["board_id"] ? "board" : "desc"}
                      communityUrl={item["board_id"] ? "b/" : "d/"}
                      onError={(message = "Something happened!") => {
                        setToast({
                          message,
                          type: "error",
                        });
                      }}
                    />
                  ))}
                </div>
              ) : (
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
              )}
            </div>
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
