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

const getKey = (item) => {
  const isBoard = item?.board_id || false;
  const itemType = isBoard ? "post" : "test";
  return `${itemType}-${item.id}`;
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

const heightStore = new HeightStore();

/* ---------------- Measurement Component ---------------- */
function ItemMeasurer({ item, onMeasured }) {
  const ref = useRef(null);
  const measuredRef = useRef(false);

  useLayoutEffect(() => {
    if (!ref.current || measuredRef.current) return;

    const key = getKey(item);
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
function useMeasure(item, onResize) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const key = getKey(item);

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
  }, [item.id, onResize]);

  return ref;
}

/* ---------------- Virtual Item ---------------- */
function VirtualItem({ item, index, onResize, likedData }) {
  const ref = useMeasure(item, onResize);

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
}) {
  const { hasFetchRequest } = useSelector((s) => s.homeFeed);
  const dispatch = useDispatch();

  const containerRef = useRef(null);
  const [range, setRange] = useState({ start: 0, end: 20 });
  const [, forceUpdate] = useState({});
  const [measuringPhase, setMeasuringPhase] = useState(true);
  const [, setMeasuredCount] = useState(0);
  const pendingScrollAdjustmentRef = useRef(0);
  const rafIdRef = useRef(null);

  const OVERSCAN = 5;
  const INITIAL_MEASURE_COUNT = Math.min(20, items.length); // Measure first 20 items

  // Reset measuring phase when items change significantly
  useEffect(() => {
    const needsMeasurement = items
      .slice(0, INITIAL_MEASURE_COUNT)
      .some((item) => !heightStore.has(getKey(item)));

    if (needsMeasurement && items.length > 0) {
      setMeasuringPhase(true);
      setMeasuredCount(0);
    }
  }, [items.length]);

  // Subscribe to height changes
  useEffect(() => {
    return heightStore.subscribe(() => {
      forceUpdate({});
    });
  }, []);

  // Handle initial measurements
  const handleItemMeasured = useCallback(
    (key, height) => {
      setMeasuredCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= INITIAL_MEASURE_COUNT) {
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
      const key = getKey(items[i]);
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
        const itemIndex = items.findIndex((item) => getKey(item) === key);

        if (itemIndex !== -1 && itemIndex < range.start) {
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
    if (isNearBottom && !hasFetchRequest && items.length > 0) {
      dispatch(setHasFetchRequest({ state: !hasFetchRequest }));
    }
    recomputeRange();
  }, [prefixSums, items.length, hasFetchRequest, dispatch, recomputeRange, range.end]);

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
  if (measuringPhase) {
    return (
      <div style={{ overflow: "auto", height: "100vh" }}>
        {children}
        <div
          style={{ visibility: "hidden", position: "absolute", width: "100%" }}
        >
          {items.slice(0, INITIAL_MEASURE_COUNT).map((item) => (
            <ItemMeasurer
              key={getKey(item)}
              item={item}
              onMeasured={handleItemMeasured}
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

  const topSpacerHeight = prefixSums[range.start] || 0;
  const bottomSpacerHeight =
    prefixSums[items.length] - (prefixSums[range.end] || 0);

  return (
    <div ref={containerRef} style={{ overflow: "auto", height: "100vh" }}>
      {children}
      <div style={{ height: topSpacerHeight }} aria-hidden="true" />
      {items.slice(range.start, range.end).map((item, idx) => {
        const globalIndex = range.start + idx;
        return (
          <VirtualItem
            key={getKey(item)}
            item={item}
            index={globalIndex}
            onResize={handleResize}
            likedData={likedData}
          />
        );
      })}
      <div style={{ height: bottomSpacerHeight }} aria-hidden="true" />
    </div>
  );
}
