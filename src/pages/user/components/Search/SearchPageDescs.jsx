import React, { useMemo } from "react";
import { useSearchDescsQuery } from "../../../../services/descsApi";
import SearchPageHeader from "./SearchPageHeader";
import CommunitySkeleton from "../Skeleton/CommunitySkeleton";
import { Link, useNavigate } from "react-router-dom";
import { getFileUrl, getInitials } from "../../../../utils";
import { useSelector } from "react-redux";
import { useSubscribeToDescMutation, useUnsubscribeFromDescMutation } from "../../../../services/descSubscriptionsApi";

const SearchPageDescs = ({ query, activeTab, onSelectTab }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const {
    data: items,
    isFetching,
    isSuccess,
  } = useSearchDescsQuery({ search: query });
  const subscribedIds = useMemo(
    () => new Set(items?.subscribed ?? []),
    [items]
  );

  const [subscribeToDesc, { isLoading: isSubscribing }] =
    useSubscribeToDescMutation();
  const [unsubscribeFromDesc, { isLoading: isUnsubscribing }] =
    useUnsubscribeFromDescMutation();

  const onSubscribe = async (e, desc) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await subscribeToDesc({ desc: desc.name }).unwrap();
      subscribedIds.add(desc.id)
    } catch (err) {
      console.error("Failed to subscribe:", err);
    }
  };

  const onUnSubscribe = async (e, desc) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await unsubscribeFromDesc({ desc: desc.name }).unwrap();
      subscribedIds.add(desc.id)
    } catch (err) {
      console.error("Failed to unsubscribe:", err);
    }
  };
  return isFetching && !isSuccess ? (
    <div className="h-screen overflow-auto">
      <SearchPageHeader onSelect={() => null} activeTab={activeTab} />
      <div className="virtual-item-padding flex flex-col gap-2">
        {Array(5)
          .fill(0)
          .map((_, idx) => (
            <CommunitySkeleton key={idx} />
          ))}
      </div>
    </div>
  ) : (
    <div className="h-screen overflow-y-auto">
      <SearchPageHeader onSelect={onSelectTab} activeTab={activeTab} />
      <main className="flex flex-col gap-2 virtual-item-padding">
        {items?.data.map((element, ind) => (
          <div
            key={element.id}
            className="flex bg-white border border-neutral-200 items-start justify-between gap-3 p-2 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            <Link
              to={`/b/${element.name}`}
              className="flex items-center gap-3 flex-1 min-w-0"
            >
              <div className="w-12 h-12  rounded-full overflow-hidden border-4 border-white bg-white">
                {element?.avatar === null ? (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {getInitials(element.name)}
                  </div>
                ) : (
                  <img
                    src={getFileUrl(element.avatar?.file_hash)}
                    alt="Board avatar"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-neutral-900 mb-0.5">
                  {`b/${element.name}`}
                </h3>
                <p className="text-xs text-neutral-600 line-clamp-1">
                  {element.description || "No description"}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {element.subscribers_count} members • {element.posts_count}{" "}
                  posts
                </p>
              </div>
            </Link>
            <div
              className={`flex items-center gap-2  rounded-full border ${
                subscribedIds.has(element.id)
                  ? "border-red-500"
                  : "border-primary-blue hover:border-blue-700"
              }
                     `}
            >
              {subscribedIds.has(element.id) ? (
                <button
                  className="px-3 py-2 text-red-500 active:scale-95 transition-all duration-200 font-medium text-sm whitespace-nowrap cursor-pointer"
                  onClick={(e) => onUnSubscribe(e, element)}
                  disabled={isUnsubscribing}
                >
                  <span>Joined</span>
                </button>
              ) : (
                <button
                  className="px-5 py-2 text-primary-blue active:scale-95 transition-all duration-200 font-medium text-sm whitespace-nowrap cursor-pointer"
                  onClick={(e) => onSubscribe(e, element)}
                  disabled={isSubscribing}
                >
                  <span>Join</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default SearchPageDescs;
