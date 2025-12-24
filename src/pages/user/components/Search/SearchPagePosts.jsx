import React from "react";
import SearchPageHeader from "./SearchPageHeader";
import PostCardSkeleton from "../Skeleton/PostCardSkeleton";
import InfiniteItemCards from "../Virtualized/InfiniteItemCards";
import { useGetPostsBySearchQuery } from "../../../../services/postsApi";

const SearchPagePosts = ({ activeTab, onSelectTab, query }) => {
  const {
    data: items,
    isFetching,
    isSuccess,
  } = useGetPostsBySearchQuery({ search: query });
  //TODO: a callback function for pagination
  return isFetching ? (
    <div className="h-screen overflow-auto">
      <SearchPageHeader onSelect={() => null} activeTab={activeTab} />

      <div className="virtual-item-padding">
        {Array(5)
          .fill(0)
          .map((_, idx) => (
            <PostCardSkeleton
              key={idx}
              isLast={idx === 5 - 1}
              isFirst={idx === 0}
            />
          ))}
      </div>
    </div>
  ) : isSuccess ? (
    <InfiniteItemCards
      key={`tab=${activeTab}-type=post`}
      items={items?.data ?? []}
      headerElements={[
        (ref) => (
          <SearchPageHeader
            ref={ref}
            onSelect={onSelectTab}
            activeTab={activeTab}
          />
        ),
      ]}
      layoutSchemaVersion={"searchPage-postCards"}
      layoutVersion={`tab=${activeTab}-type=post`}
      likedData={new Set(items?.liked ?? [])}
      onNearBottom={() => console.log("The End")}
      tab={activeTab}
    />
  ) : null;
};

export default SearchPagePosts;
