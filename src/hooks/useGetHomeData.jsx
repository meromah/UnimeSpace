import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useGetTestsByFilterQuery,
  useGetUserFollowingFeedTestsQuery,
} from "../services/testsApi";
import {
  useGetPostsByFilterQuery,
  useGetUserFollowingFeedPostsQuery,
} from "../services/postsApi";
import { TabFilters } from "../utils/tabFilters";
import { useDispatch, useSelector } from "react-redux";
import {
  mergeSorted,
  nextPage,
  resetFeed,
  setItems,
} from "../app/homeFeedSlice";
const tabFilters = new TabFilters();
const firstTab = tabFilters.firstValue();
const secondTab = tabFilters.secondValue();

const PAGE_SIZE = 50;
const useGetHomeData = ({ sortBy, sortByType, tab }) => {
  /* ----------------------------------*/
  /* Redux */
  /* ----------------------------------*/

  const { items, page, hasFetchRequest } = useSelector(
    (state) => state.homeFeed
  );
  const dispatch = useDispatch();

  /* ----------------------------------*/
  /* States */
  /* ----------------------------------*/
  const [error, setError] = useState({
    [firstTab]: {
      hasError: false,
      status: undefined,
      message: undefined,
    },
    [secondTab]: {
      hasError: false,
      status: undefined,
      message: undefined,
    },
  });
  const [hasMore, setHasMore] = useState({
    posts: true,
    tests: true,
    followingPosts: true,
    followingTests: true,
  });
  const [isFetching, setIsFetching] = useState(false);

  /* ----------------------------------*/
  /* Refs */
  /* ----------------------------------*/
  const remainingRef = useRef({
    posts: 1,
    tests: 1,
    followingPosts: 1,
    followingTests: 1,
  });
  const loaderRef = useRef(null);
  const requestedPageRef = useRef(page[tab]);
  const {
    data: tests,
    isFetching: isTestsFetching,
    error: testsError,
    isError: isTestsError,
    isSuccess: isTestsSuccess,
  } = useGetTestsByFilterQuery(
    { queryParams: `${sortBy}&page=${page[tab]}` },
    {
      skip:
        sortByType === "posts" ||
        tab !== tabFilters.firstValue() ||
        !hasMore.tests,
    }
  );

  /* ----------------------------------*/
  /* API Queries */
  /* ----------------------------------*/
  const {
    data: posts,
    isFetching: isPostsFetching,
    error: postsError,
    isError: isPostsError,
    isSuccess: isPostsSuccess,
  } = useGetPostsByFilterQuery(
    { queryParams: `${sortBy}&page=${page[tab]}` },
    {
      skip:
        sortByType === "tests" ||
        tab !== tabFilters.firstValue() ||
        !hasMore.posts,
    }
  );
  const {
    data: followingTests,
    isFetching: isFollowingTestsFetching,
    error: followingTestsError,
    isError: isFollowingTestsError,
    isSuccess: isFollowingTestsSuccess,
  } = useGetUserFollowingFeedTestsQuery(
    { queryParams: `page=${page[tab]}` },
    {
      skip:
        tab !== tabFilters.secondValue() ||
        (tab !== tabFilters.secondValue() && !hasMore.followingTests),
    }
  );
  const {
    data: followingPosts,
    isFetching: isFollowingPostsFetching,
    error: followingPostsError,
    isError: isFollowingPostsError,
    isSuccess: isFollowingPostsSuccess,
  } = useGetUserFollowingFeedPostsQuery(
    { queryParams: `page=${page[tab]}` },
    {
      skip:
        tab !== tabFilters.secondValue() ||
        (tab !== tabFilters.secondValue() && !hasMore.followingPosts),
    }
  );

  /* ----------------------------------*/
  /* useMemo - Derive Data */
  /* ----------------------------------*/
  const likedData = useMemo(() => {
    if (tab === tabFilters.firstValue()) {
      return {
        post: new Set(posts?.liked || []),
        test: new Set(tests?.liked || []),
      };
    }
    return {
      post: new Set(followingPosts?.liked || []),
      test: new Set(followingTests?.liked || []),
    };
  }, [
    posts?.likedData,
    tests?.likedData,
    followingPosts?.likedData,
    followingTests?.likedData,
    tab,
  ]);
  const isSuccess = useMemo(() => {
    const isFirstTab = tab === tabFilters.firstValue();
    const isSecondTab = tab === tabFilters.secondValue();

    if (isFirstTab) {
      const successMap = {
        all: isPostsSuccess && isTestsSuccess,
        posts: isPostsSuccess,
        tests: isTestsSuccess,
      };

      return successMap[sortByType] ?? false;
    }

    if (isSecondTab) {
      const {
        followingPosts: hasFollowingPosts,
        followingTests: hasFollowingTests,
      } = hasMore;

      if (hasFollowingPosts && hasFollowingTests) {
        return isFollowingPostsSuccess && isFollowingTestsSuccess;
      }

      if (hasFollowingPosts) return isFollowingPostsSuccess;
      if (hasFollowingTests) return isFollowingTestsSuccess;

      return false;
    }

    return false;
  }, [
    tab,
    sortByType,
    hasMore,
    isPostsSuccess,
    isTestsSuccess,
    isFollowingPostsSuccess,
    isFollowingTestsSuccess,
  ]);

  /* ----------------------------------*/
  /* useEffects */
  /* ----------------------------------*/

  //Reset feed data for one of the dependencies changes
  useEffect(() => {
    dispatch(resetFeed({ sortBy, itemType: sortByType, tab }));
  }, [sortBy, sortByType, dispatch, tab]);

  //Save data to Redux if for the 'for-you' tab
  useEffect(() => {
    // Determine active data source
    if (tab === tabFilters.secondValue()) return;
    const getActiveData = { posts, tests };
    const activeData = getActiveData[sortByType];

    // Update data
    if (sortByType === "all") {
      if (isSuccess && posts?.data && tests?.data) {
        dispatch(
          mergeSorted({
            data1: remainingRef.current.posts ? posts.data : [],
            data2: remainingRef.current.tests ? tests.data : [],
            sortBy,
            itemType: sortByType,
            page: page[tab],
            tab,
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
            tab,
          })
        );
      }
    }
  }, [sortBy, sortByType, tab, isSuccess, posts?.data, tests?.data]);

  //Save data to Redux if the tab is 'following'
  useEffect(() => {
    if (tab === tabFilters.firstValue()) return;
    if (isSuccess && followingPosts?.data && followingTests?.data) {
      dispatch(
        mergeSorted({
          data1: remainingRef.current.followingPosts ? followingPosts.data : [],
          data2: remainingRef.current.followingTests ? followingTests.data : [],
          sortBy,
          itemType: sortByType,
          page: page[tab],
          tab,
        })
      );
    }
  }, [followingPosts, followingTests, isSuccess, tab]);

  //Extract error from API queries
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
      setError((e) => ({
        ...e,
        [firstTab]: {
          hasError: true,
          status: activeError.status,
          message: activeError.data?.message,
        },
      }));
    } else if (isActiveError === false) {
      setError((e) => ({
        ...e,
        [firstTab]: { hasError: false, status: undefined, message: undefined },
      }));
    }
  }, [postsError, testsError, isPostsError, isTestsError]);
  useEffect(() => {
    if (isFollowingPostsError && followingPostsError) {
      setError((e) => ({
        ...e,
        [secondTab]: {
          hasError: true,
          status: followingPostsError.status,
          message: followingPostsError.data?.message,
        },
      }));
    } else if (isFollowingTestsError && followingTestsError) {
      setError((e) => ({
        ...e,
        [secondTab]: {
          hasError: true,
          status: followingTestsError.status,
          message: followingTestsError.data?.message,
        },
      }));
    } else {
      setError((e) => ({
        ...e,
        [secondTab]: { hasError: false, status: undefined, message: undefined },
      }));
    }
  }, [
    isFollowingPostsError,
    isFollowingTestsError,
    followingTestsError,
    followingPostsError,
  ]);

  //Extract isFetching from API queries
  useEffect(() => {
    if (tab === tabFilters.firstValue()) {
      const anyFetching =
        (sortByType === "all" && (isPostsFetching || isTestsFetching)) ||
        (sortByType === "posts" && isPostsFetching) ||
        (sortByType === "tests" && isTestsFetching);
      setIsFetching(Boolean(anyFetching));
    }
  }, [isPostsFetching, isTestsFetching, sortByType]);
  useEffect(() => {
    if (tab === tabFilters.secondValue()) {
      const anyFetching = isFollowingPostsFetching || isFollowingTestsFetching;
      setIsFetching(Boolean(anyFetching));
    }
  }, [isFollowingPostsFetching, isFollowingTestsFetching]);

  //Checking if the data available to fetch from API queries
  useEffect(() => {
    if (tab !== tabFilters.firstValue()) return;
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
    if (tab !== tabFilters.secondValue()) return;
    if (followingPosts && followingPosts.data) {
      const got = followingPosts.data.length;
      setHasMore((s) => ({ ...s, followingPosts: got >= PAGE_SIZE }));
    }
    if (followingTests && followingTests.data) {
      const got = followingTests.data.length;
      setHasMore((s) => ({ ...s, followingTests: got >= PAGE_SIZE }));
    }
  }, [followingPosts, followingTests, tab]);

  /* ----------------------------------*/
  /* Pagination useEffect*/
  /* ----------------------------------*/
  useEffect(() => {
    requestedPageRef.current = page[tab];
  }, [page[tab]]);
  useEffect(() => {
    const canFetchMore =
      sortByType === "all"
        ? hasMore.posts || hasMore.tests
        : sortByType === "posts"
        ? hasMore.posts
        : hasMore.tests;

    const alreadyRequested = requestedPageRef.current > page[tab];
    if (
      !isFetching &&
      isSuccess &&
      canFetchMore &&
      !alreadyRequested &&
      hasFetchRequest[tab]
    ) {
      requestedPageRef.current = page[tab] + 1;
      dispatch(nextPage({ tab }));
      if (!hasMore.posts) {
        remainingRef.current.posts = 0;
      }
      if (!hasMore.tests) {
        remainingRef.current.tests = 0;
      }
      if (!hasMore.followingPosts) {
        remainingRef.current.followingPosts = 0;
      }
      if (!hasMore.followingTests) {
        remainingRef.current.followingTests = 0;
      }
    }
  }, [
    dispatch,
    isFetching,
    isSuccess,
    page[tab],
    sortByType,
    hasMore,
    hasFetchRequest[tab],
    items,
  ]);
  return {
    data: items[tab],
    likedData,
    error,
    isFetching,
    loaderRef,
    hasMore,
    isSuccess,
    page: page[tab],
    requestedPageRef,
  };
};

export default useGetHomeData;
