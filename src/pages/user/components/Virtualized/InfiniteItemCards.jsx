import React, {
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import PostCard from "../PostCard";
import { useDispatch, useSelector } from "react-redux";
import { setHasFetchRequest } from "../../../../app/homeFeedSlice";
const getKey = (item, tab) => {
  const isBoard = item?.board_id || false;
  const communityName = isBoard ? item.board_id : item.desc_id;
  const itemType = isBoard ? "post" : "test";
  return `${tab}-${communityName}-${itemType}-${item.id}`;
};

/* ---------------- Persistent Height Store ---------------- */
class HeightStore {
  constructor() {
    this.heights = new Map();
    this.listeners = new Set();
  }

  get(key) {
    return this.heights.get(key);
  }

  has(key) {
    return this.heights.has(key);
  }

  set(key, value) {
    const changed = this.heights.get(key) !== value;
    this.heights.set(key, value);
    if (changed) {
      this.notifyListeners();
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach((cb) => cb());
  }

  clear() {
    this.heights.clear();
    this.notifyListeners();
  }
}

const heightStores = new Map();
const getHeightStore = (tab) => {
  if (!heightStores.has(tab)) {
    heightStores.set(tab, new HeightStore());
  }
  return heightStores.get(tab);
};
/* ---------------- Measurement Component ---------------- */
function ItemMeasurer({ item, onMeasured, heightStore, tab }) {
  const ref = useRef(null);
  const measuredRef = useRef(false);

  useLayoutEffect(() => {
    if (!ref.current || measuredRef.current) return;

    const key = getKey(item, tab);
    const height = ref.current.offsetHeight;

    if (height > 0) {
      heightStore.set(key, height);
      measuredRef.current = true;
      onMeasured(key, height);
    }
  }, [item, onMeasured]);

  const isBoard = item?.board_id || false;
  const itemType = isBoard ? "post" : "test";
  const communityType = isBoard ? "board" : "desc";
  const communityUrl = isBoard ? "b/" : "d/";

  const handleError = useCallback((message = "Something happened!") => {
    console.error(message);
  }, []);

  return (
    <div ref={ref} className="virtual-item-padding-x">
      <PostCard
        item={item}
        onError={handleError}
        isFirst={false}
        isLast={false}
        itemType={itemType}
        communityType={communityType}
        communityUrl={communityUrl}
        isLiked={false}
      />
    </div>
  );
}

/* ---------------- Stable Resize Observer Hook ---------------- */
function useMeasure(item, onResize, heightStore, tab) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const key = getKey(item, tab);

    const ro = new ResizeObserver(([entry]) => {
      const newHeight = entry.contentRect.height;
      const oldHeight = heightStore.get(key);

      if (newHeight > 0 && oldHeight !== newHeight) {
        heightStore.set(key, newHeight);
        onResize(key, newHeight, oldHeight || 0);
      }
    });

    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [item.id, tab, heightStore, onResize]);

  return ref;
}

/* ---------------- Virtual Item ---------------- */
function VirtualItem({ item, index, onResize, likedData, heightStore, tab }) {
  const ref = useMeasure(item, onResize, heightStore, tab);

  const isBoard = item?.board_id || false;
  const itemType = isBoard ? "post" : "test";
  const communityType = isBoard ? "board" : "desc";
  const communityUrl = isBoard ? "b/" : "d/";

  const handleError = useCallback((message = "Something happened!") => {
    console.error(message);
  }, []);

  return (
    <div ref={ref} className="virtual-item-padding-x">
      <PostCard
        item={item}
        onError={handleError}
        isFirst={index === 0}
        isLast={false}
        itemType={itemType}
        communityType={communityType}
        communityUrl={communityUrl}
        isLiked={likedData[itemType].has(item.id)}
      />
    </div>
  );
}

/* ---------------- Feed Window ---------------- */
export default function InfiniteItemCards({
  items,
  children,
  likedData,
  tab,
  error = {
    hasError: false,
    status: undefined,
    message: undefined,
  },
  layoutVersion
}) {
  const INITIAL_MEASURE_COUNT = useMemo(() => Math.min(20, items.length), [items?.length]); // Measure first 20 items
  const { hasFetchRequest } = useSelector((s) => s.homeFeed);
  const dispatch = useDispatch();

  const containerRef = useRef(null);
  const [range, setRange] = useState({ start: 0, end: INITIAL_MEASURE_COUNT });
  const [, forceUpdate] = useState({});
  const [measuringPhase, setMeasuringPhase] = useState(true);
  const [, setMeasuredCount] = useState(0);
  const pendingScrollAdjustmentRef = useRef(0);
  const rafIdRef = useRef(null);

  const OVERSCAN = 5;
  const heightStore = useMemo(() => getHeightStore(tab), [tab]);
  // Reset measuring phase when items change significantly
  useEffect(() => {
    const needsMeasurement = items
      .slice(0, INITIAL_MEASURE_COUNT)
      .some((item) => !heightStore.has(getKey(item, tab)));

    if (needsMeasurement && items.length > 0) {
      setMeasuringPhase(true);
      setMeasuredCount(0);
    }
  }, [items.length, tab, heightStore]);

  // Subscribe to height changes
  useEffect(() => {
    return heightStore.subscribe(() => {
      forceUpdate({});
    });
  }, [heightStore]);

  // Handle initial measurements
  const handleItemMeasured = useCallback(
    (key, height) => {
      setMeasuredCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= Math.min(INITIAL_MEASURE_COUNT, items.length)) {
          setMeasuringPhase(false);
        }
        return newCount;
      });
    },
    [INITIAL_MEASURE_COUNT]
  );

  // Compute prefix sums ONLY with measured heights
  const prefixSums = useMemo(() => {
    if (measuringPhase) return null;

    const sums = new Array(items.length + 1).fill(0);

    for (let i = 0; i < items.length; i++) {
      const key = getKey(items[i], tab);
      const height = heightStore.get(key);

      if (height === undefined) {
        const avgHeight = i > 0 ? sums[i] / i : 400;
        sums[i + 1] = sums[i] + avgHeight;
      } else {
        sums[i + 1] = sums[i] + height;
      }
    }

    return sums;
  }, [items, measuringPhase, forceUpdate]);

  const indexMap = useMemo(() => {
    const map = new Map();
    items.forEach((item, i) => {
      map.set(getKey(item, tab), i);
    });
    return map;
  }, [items, tab]);

  // Binary search that handles partial visibility correctly
  const findStartIndex = useCallback(
    (scrollTop) => {
      if (!prefixSums) return 0;

      let low = 0;
      let high = items.length;

      while (low < high) {
        const mid = Math.floor((low + high) / 2);
        if (prefixSums[mid + 1] <= scrollTop) {
          low = mid + 1;
        } else if (prefixSums[mid] > scrollTop) {
          high = mid;
        } else {
          return mid;
        }
      }
      return Math.min(low, items.length - 1);
    },
    [prefixSums, items.length]
  );

  const recomputeRange = useCallback(() => {
    if (!containerRef.current || items.length === 0 || !prefixSums) return;

    const scrollTop = containerRef.current.scrollTop;
    const viewportHeight = containerRef.current.clientHeight;

    const startIdx = findStartIndex(scrollTop);
    const endIdx = findStartIndex(scrollTop + viewportHeight);

    const overscanStart = Math.max(0, startIdx - OVERSCAN);
    const overscanEnd = Math.min(items.length, endIdx + OVERSCAN + 1);

    setRange({ start: overscanStart, end: overscanEnd });
  }, [findStartIndex, items.length, prefixSums]);

  // Batched scroll compensation
  const scheduleScrollAdjustment = useCallback((delta) => {
    pendingScrollAdjustmentRef.current += delta;

    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(() => {
        if (containerRef.current && pendingScrollAdjustmentRef.current !== 0) {
          containerRef.current.scrollTop += pendingScrollAdjustmentRef.current;
          pendingScrollAdjustmentRef.current = 0;
        }
        rafIdRef.current = null;
      });
    }
  }, []);

  // Handle resize with batched scroll compensation
  const handleResize = useCallback(
    (key, newHeight, oldHeight) => {
      const delta = newHeight - oldHeight;

      if (delta !== 0) {
        const itemIndex = indexMap.get(key);

        if (itemIndex !== undefined && itemIndex < range.start) {
          scheduleScrollAdjustment(delta);
        }
      }
    },
    [items, range.start, scheduleScrollAdjustment]
  );

  // Stable scroll handler
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !prefixSums) return;
    const isNearBottom = items.length === range.end;
    if (isNearBottom && !hasFetchRequest[tab] && items.length > 0) {
      dispatch(setHasFetchRequest({ state: !hasFetchRequest[tab], tab }));
    }
    recomputeRange();
  }, [
    prefixSums,
    items.length,
    hasFetchRequest[tab],
    dispatch,
    recomputeRange,
    range.end,
  ]);

  // Throttled scroll with stable reference
  const throttledHandleScroll = useMemo(() => {
    let rafId = null;
    let lastArgs = null;

    return (...args) => {
      lastArgs = args;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          handleScroll(...lastArgs);
          rafId = null;
        });
      }
    };
  }, [handleScroll]);

  // Initial range computation
  useEffect(() => {
    if (!measuringPhase) {
      recomputeRange();
    }
  }, [measuringPhase, items.length, recomputeRange]);
  useEffect(() => {
    if (items.length === 0) {
      setMeasuringPhase(false);
      setRange({ start: 0, end: 0 });
    }
  }, [items.length]);
  useEffect(() => {
    if(layoutVersion === undefined) return
    // Hard layout reset
    setRange({ start: 0, end: INITIAL_MEASURE_COUNT });
    containerRef.current?.scrollTo(0, 0);

    // Prefix sums must be recomputed
    setMeasuringPhase(true);
    setMeasuredCount(0);
  }, [layoutVersion]);
  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", throttledHandleScroll, {
      passive: true,
    });

    return () => {
      container.removeEventListener("scroll", throttledHandleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [throttledHandleScroll]);
  // Render measuring phase
  if (measuringPhase && items.length && !error.hasError) {
    return (
      <div style={{ overflow: "auto", height: "100vh" }}>
        {children}
        <div
          style={{ visibility: "hidden", position: "absolute", width: "100%" }}
        >
          {items.slice(0, INITIAL_MEASURE_COUNT).map((item) => (
            <ItemMeasurer
              key={getKey(item, tab)}
              item={item}
              onMeasured={handleItemMeasured}
              heightStore={heightStore}
              tab={tab}
            />
          ))}
        </div>
        {/* Show loading indicator */}
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading feed...</div>
        </div>
      </div>
    );
  }

  const topSpacerHeight =
    items.length && prefixSums[range.start] ? prefixSums[range.start] : 0;
  const bottomSpacerHeight =
    items.length && prefixSums[items.length]
      ? prefixSums[items.length] - prefixSums[range.end]
      : 0;

  return (
    <div ref={containerRef} style={{ overflow: "auto", height: "100vh" }}>
      {children}
      <div style={{ height: Number.isInteger(topSpacerHeight)?topSpacerHeight: 0 }} aria-hidden="true" />
      {items.length && !error.hasError
        ? items.slice(range.start, range.end).map((item, idx) => {
            const globalIndex = range.start + idx;
            return (
              <VirtualItem
                key={getKey(item, tab)}
                item={item}
                index={globalIndex}
                onResize={handleResize}
                likedData={likedData}
                heightStore={heightStore}
                tab={tab}
              />
            );
          })
        : null}
      <div style={{ height: Number.isInteger(bottomSpacerHeight)?bottomSpacerHeight: 0 }} aria-hidden="true" />
    </div>
  );
}
