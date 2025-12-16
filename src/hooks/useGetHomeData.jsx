import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGetTestsByFilterQuery } from "../services/testsApi";
import { useGetPostsByFilterQuery } from "../services/postsApi";
import { TabFilters } from "../utils/tabFilters";
import { useDispatch, useSelector } from "react-redux";
import {
  mergeSorted,
  nextPage,
  resetFeed,
  setItems,
} from "../app/homeFeedSlice";
const tabFilters = new TabFilters();
const PAGE_SIZE = 50;
const useGetHomeData = ({ sortBy, sortByType, tab }) => {
  const { items, page, hasFetchRequest } = useSelector(
    (state) => state.homeFeed
  );
  const [error, setError] = useState({
    hasError: false,
    status: undefined,
    message: undefined,
  });
  const [hasMore, setHasMore] = useState({ posts: true, tests: true });
  const remainingRef = useRef({posts: 1, tests: 1})
  const [isFetching, setIsFetching] = useState(false);
  const dispatch = useDispatch();
  const loaderRef = useRef(null);
  const requestedPageRef = useRef(page);
  const {
    data: tests,
    isFetching: isTestsFetching,
    error: testsError,
    isError: isTestsError,
    isSuccess: isTestsSuccess,
  } = useGetTestsByFilterQuery(
    { queryParams: `${sortBy}&page=${page}` },
    {
      skip:
        sortByType === "posts" ||
        tab !== tabFilters.firstValue() ||
        !hasMore.tests,
    }
  );
  const {
    data: posts,
    isFetching: isPostsFetching,
    error: postsError,
    isError: isPostsError,
    isSuccess: isPostsSuccess,
  } = useGetPostsByFilterQuery(
    { queryParams: `${sortBy}&page=${page}` },
    {
      skip:
        sortByType === "tests" ||
        tab !== tabFilters.firstValue() ||
        !hasMore.posts,
    }
  );
  const likedData = useMemo(
    () => ({
      post: new Set(posts?.liked || []),
      test: new Set(tests?.liked || []),
    }),
    [posts, tests]
  );
  const isSuccess = useMemo(() => {
    if (sortByType === "all") {
      return isPostsSuccess && isTestsSuccess;
    } else if (sortByType === "posts") {
      return isPostsSuccess;
    } else {
      return isTestsSuccess;
    }
  }, [isPostsSuccess, isTestsSuccess, sortByType]);
  useEffect(() => {
    dispatch(resetFeed({ sortBy, itemType: sortByType }));
  }, [sortBy, sortByType, dispatch]);

  useEffect(() => {
    // Determine active data source
    const getActiveData = { [tabFilters.firstValue()]: { posts, tests } };
    const activeData = getActiveData[tab][sortByType];

    // Update data
    if (sortByType === "all") {
      if (isSuccess && posts?.data && tests?.data) {
        console.log(remainingRef.current)
        dispatch(
          mergeSorted({
            data1:remainingRef.current.posts? posts.data : [],
            data2:remainingRef.current.tests? tests.data : [],
            sortBy,
            itemType: sortByType,
            page,
          })
        );
      }
    } else {
      if (activeData?.data) {
        dispatch(
          setItems({
            data: activeData.data,
            sortBy,
            itemType: sortByType,
            page,
          })
        );
      }
    }
  }, [sortBy, sortByType, tab, isSuccess, posts, tests]);

  useEffect(() => {
    const getActiveError = {
      [tabFilters.firstValue()]: { posts: postsError, tests: testsError },
    };
    const getIsActiveError = {
      [tabFilters.firstValue()]: { posts: isPostsError, tests: isTestsError },
    };
    const activeError = getActiveError[tab][sortByType];
    const isActiveError = getIsActiveError[tab][sortByType];
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
  }, [postsError, testsError, isPostsError, isTestsError]);
  useEffect(() => {
    // if any active source is fetching, we are Fetching
    const anyFetching =
      (sortByType === "all" && (isPostsFetching || isTestsFetching)) ||
      (sortByType === "posts" && isPostsFetching) ||
      (sortByType === "tests" && isTestsFetching);

    setIsFetching(Boolean(anyFetching));
  }, [isPostsFetching, isTestsFetching, sortByType]);

  useEffect(() => {
    if (posts && posts.data) {
      const got = posts.data.length;
      setHasMore((s) => ({ ...s, posts: got >= PAGE_SIZE }));
    }
    if (tests && tests.data) {
      const got = tests.data.length;
      setHasMore((s) => ({ ...s, tests: got >= PAGE_SIZE }));
    }
  }, [posts, tests]);

  useEffect(() => {
    requestedPageRef.current = page;
  }, [page]);
  useEffect(() => {
    const canFetchMore =
      sortByType === "all"
        ? hasMore.posts || hasMore.tests
        : sortByType === "posts"
        ? hasMore.posts
        : hasMore.tests;

    const alreadyRequested = requestedPageRef.current > page;
    if (
      !isFetching &&
      isSuccess &&
      canFetchMore &&
      !alreadyRequested &&
      hasFetchRequest 
    ) {
      requestedPageRef.current = page + 1;
      dispatch(nextPage());
      if(!hasMore.posts){
        remainingRef.current.posts = 0;
      }
      if(!hasMore.tests){
        remainingRef.current.tests = 0;
      }
    }
  }, [
    dispatch,
    isFetching,
    isSuccess,
    page,
    sortByType,
    hasMore,
    hasFetchRequest,
    items
  ]);

  return {
    data: items,
    likedData,
    error,
    isFetching,
    loaderRef,
    hasMore,
    isSuccess,
    page,
    requestedPageRef,
  };
};

export default useGetHomeData;
