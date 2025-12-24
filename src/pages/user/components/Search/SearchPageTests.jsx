import React from "react";
import SearchPageHeader from "./SearchPageHeader";
import PostCardSkeleton from "../Skeleton/PostCardSkeleton";
import InfiniteItemCards from "../Virtualized/InfiniteItemCards";
import { useGetTestsBySearchQuery } from "../../../../services/testsApi";

const SearchPageTests = ({ activeTab, onSelectTab, query }) => {
  const {
    data: items,
    isFetching,
    isSuccess,
  } = useGetTestsBySearchQuery({ search: query });
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
      key={`tab=${activeTab}-type=test`}
      items={items?.data}
      headerElements={[
        (ref) => (
          <SearchPageHeader
            ref={ref}
            onSelect={onSelectTab}
            activeTab={activeTab}
          />
        ),
      ]}
      layoutSchemaVersion={"searchPage-testCards"}
      layoutVersion={`tab=${activeTab}-type=test`}
      likedData={new Set(items?.liked ?? [])}
      onNearBottom={() => console.log("The End")}
      tab={activeTab}
    />
  ) : null;
};

export default SearchPageTests;
