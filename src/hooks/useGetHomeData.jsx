import React, { useEffect, useMemo, useState } from "react";
import { useGetTestsByFilterQuery } from "../services/testsApi";
import { useGetPostsByFilterQuery } from "../services/postsApi";
import { TabFilters } from "../utils/tabFilters";
const tabFilters = new TabFilters();
const useGetHomeData = ({ sortBy, sortByType, tab }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState({
    hasError: false,
    status: undefined,
    message: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: tests,
    isLoading: isTestsLoading,
    error: testsError,
    isError: isTestsError,
  } = useGetTestsByFilterQuery(
    { queryParams: sortBy },
    { skip: sortByType === "posts" || tab !== tabFilters.firstValue() }
  );
  const {
    data: posts,
    isLoading: isPostsLoading,
    error: postsError,
    isError: isPostsError,
  } = useGetPostsByFilterQuery(
    { queryParams: sortBy },
    { skip: sortByType === "tests" || tab !== tabFilters.firstValue() }
  );
  const likedData = useMemo(
    () => ({
      post: new Set(posts?.liked || []),
      test: new Set(tests?.liked || []),
    }),
    [posts, tests]
  );

  useEffect(() => {
    // Determine active data source
    const getActiveData = { [tabFilters.firstValue()]: { posts, tests } };
    const getIsActiveLoading = {
      [tabFilters.firstValue()]: {
        posts: isPostsLoading,
        tests: isTestsLoading,
      },
    };
    const getActiveError = {
      [tabFilters.firstValue()]: { posts: postsError, tests: testsError },
    };
    const getIsActiveError = {
      [tabFilters.firstValue()]: { posts: isPostsError, tests: isTestsError },
    };

    const activeData = getActiveData[tab][sortByType];
    const isActiveLoading = getIsActiveLoading[tab][sortByType];
    const activeError = getActiveError[tab][sortByType];
    const isActiveError = getIsActiveError[tab][sortByType];
    // Update data
    if (sortByType === "all") {
      function mergeSortedBy(a = [], b = []) {
        const result = [];
        let i = 0,
          j = 0;
        // SortBy Date
        if (sortBy === "latest=1" || sortBy === "oldest1") {
          while (i < a.length && j < b.length) {
            const dateA = new Date(a[i].created_at);
            const dateB = new Date(b[j].created_at);
            switch (sortBy) {
              case "latest=1":
                if (dateA >= dateB) {
                  result.push(a[i]);
                  i++;
                } else {
                  result.push(b[j]);
                  j++;
                }
                break;
              case "oldest=1":
                if (dateA <= dateB) {
                  result.push(a[i]);
                  i++;
                } else {
                  result.push(b[j]);
                  j++;
                }
                break;

              default:
                break;
            }
          }
        }
        // SortBy Popularity
        if (sortBy === "popular=1") {
          while (i < a.length && j < b.length) {
            const itemA = Number(a[i].likes_count);
            const itemB = Number(b[j].likes_count);
            if (itemA >= itemB) {
              result.push(a[i]);
              i++;
            } else {
              result.push(b[j]);
              j++;
            }
          }
        }
        if (sortBy === "hot=1") {
          while (i < a.length && j < b.length) {
            const itemA = Number(a[i].comments_count);
            const itemB = Number(b[j].comments_count);
            if (itemA >= itemB) {
              result.push(a[i]);
              i++;
            } else {
              result.push(b[j]);
              j++;
            }
          }
        }
        // Append remaining items
        return result.concat(a.slice(i)).concat(b.slice(j));
      }
      if (posts?.data && tests?.data) {
        const result = mergeSortedBy(posts.data, tests.data);
        setData(result);
      }
    } else {
      if (activeData?.data) {
        setData(activeData.data);
      }
    }

    // Update error state
    if (isActiveError && activeError) {
      setError({
        hasError: true,
        status: activeError.status,
        message: activeError.data?.message,
      });
    } else if (isActiveError === false) {
      setError({ hasError: false, status: undefined, message: undefined });
    }

    setIsLoading(isActiveLoading || false);
  }, [
    sortBy,
    sortByType,
    tab,
    posts,
    tests,
    isPostsLoading,
    isTestsLoading,
    postsError,
    testsError,
    isPostsError,
    isTestsError,
  ]);
  return { data, likedData, error, isLoading };
};

export default useGetHomeData;
