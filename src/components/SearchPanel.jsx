import React, { useRef, useState, useEffect, useCallback } from "react";
import { FiSearch, FiX, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSearchBoardsQuery } from "../services/boardsApi";
import { useSearchDescsQuery } from "../services/descsApi";
import { toQueryString } from "../utils";

/* -------------------- debounce hook -------------------- */
function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

/* -------------------- SearchResult -------------------- */
const SearchResult = ({
  id,
  title,
  result = [],
  itemUrl,
  isLoading,
  emptyStateMessage,
  isExpanded,
  toggleSection,
  onSelectItem,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <button
        type="button"
        onClick={() => toggleSection(id)}
        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-900 hover:bg-neutral-50 rounded-lg transition"
      >
        <span className="flex-1 text-left">{title}</span>
        <FiChevronDown
          className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expandable content */}
      <div
        className={`overflow-hidden transition-all duration-200 ease-out ${
          isExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
        }`}
      >
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
          </div>
        ) : result.length > 0 ? (
          <ul className="space-y-0.5 px-2">
            {result.map((item) => (
              <li key={`${itemUrl}${item.id}`}>
                <button
                  type="button"
                  className="w-full flex items-center px-3 py-2.5 rounded-lg hover:bg-neutral-100 transition text-left"
                  onClick={() => {
                    navigate(`/${itemUrl}${item.name}`);
                    onSelectItem();
                  }}
                >
                  <span className="text-sm text-neutral-900 truncate">
                    {item.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-2 text-sm text-neutral-500">
            {emptyStateMessage}
          </p>
        )}
      </div>
    </div>
  );
};

/* -------------------- SearchPanel -------------------- */
const SearchPanel = ({ className }) => {
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    boards: true,
    descs: true,
  });

  const debouncedQuery = useDebouncedValue(searchQuery.trim(), 300);
  const skip = debouncedQuery.length === 0;

  const { data: boardsData = [], isLoading: isBoardsLoading } =
    useSearchBoardsQuery(skip ? undefined : { search: debouncedQuery }, {
      skip,
    });

  const { data: descsData = [], isLoading: isDescsLoading } =
    useSearchDescsQuery(skip ? undefined : { search: debouncedQuery }, {
      skip,
    });

  /* -------- outside click -------- */
  useEffect(() => {
    const handlePointerDown = (e) => {
      if (!panelRef.current?.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown, true);
    return () =>
      window.removeEventListener("pointerdown", handlePointerDown, true);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (debouncedQuery?.length <= 0) return;

      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch()
      }
      if (e.key === "Escape") {
        // setOpen(false);
        // setActiveIndex(-1);
      }
    },
    [debouncedQuery]
  );
  const toggleSection = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };
  const handleSearch = ()=>{
    const searchQuery = toQueryString({query: debouncedQuery})
    navigate(`/search${searchQuery}`)
  }
  return (
    <section ref={panelRef} className="relative w-full">
      <div className={className}>
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />

          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search anything"
            className="w-full py-3 pl-10 pr-10 text-sm text-neutral-900 placeholder:text-neutral-400 bg-neutral-50 border border-neutral-200 rounded-full focus:outline-none focus:bg-white focus:border-neutral-300 focus:ring-4 focus:ring-neutral-100 transition"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-neutral-100 transition"
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      {showDropdown && debouncedQuery && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg">
          <div className="max-h-[60vh] overflow-y-auto grid gap-2 py-2">
            <p onClick={()=> handleSearch()} className="flex items-center gap-2 px-4 py-4 text-sm text-neutral-500 cursor-pointer select-none hover:text-neutral-800">
              <span className="text-lg text-neutral-900"><FiSearch/></span>
              <span>{debouncedQuery}</span>
            </p>
            {boardsData?.length > 0 &&
            descsData?.length > 0 &&
            !isBoardsLoading &&
            !isDescsLoading ? (
              <>
                <SearchResult
                  id="boards"
                  title="Boards"
                  itemUrl="b/"
                  result={boardsData}
                  isLoading={isBoardsLoading}
                  emptyStateMessage={`No boards found for "${debouncedQuery}"`}
                  isExpanded={expandedSections.boards}
                  toggleSection={toggleSection}
                  onSelectItem={clearSearch}
                />

                <SearchResult
                  id="descs"
                  title="Descs"
                  itemUrl="d/"
                  result={descsData}
                  isLoading={isDescsLoading}
                  emptyStateMessage={`No descs found for "${debouncedQuery}"`}
                  isExpanded={expandedSections.descs}
                  toggleSection={toggleSection}
                  onSelectItem={clearSearch}
                />
              </>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
};

export default SearchPanel;
