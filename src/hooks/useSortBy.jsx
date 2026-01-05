import { useState, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";

const useSortBy = ({
  isAuthenticated,
  sortOptionsConfig = [],
  initialSort = false,
  searchParam = false,
  setSearchParams,
}) => {
  // Sorting/Filtering State
  const [sortBy, setSortBy] = useState(() => {
    if (!initialSort) return sortOptionsConfig[0].id;
    const initialOption = sortOptionsConfig.find(
      (option) => option.id === initialSort
    );
    if (!initialOption) return sortOptionsConfig[0].id;
    return initialOption.id;
  });
  const [label, setLabel] = useState(() => {
    if (initialSort) {
      const initialOption = sortOptionsConfig.find(
        (option) => option.id === initialSort
      );
      if (initialOption) {
        return initialOption.label;
      }
    }
    return sortOptionsConfig[0].label;
  });
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Get current sort option configuration
  const currentSortOption =
    sortOptionsConfig.find((option) => option.id === sortBy) ||
    sortOptionsConfig[0];

  // Get available sort options based on authentication
  const availableSortOptions = sortOptionsConfig.filter(
    (option) => !option.requiresAuth || isAuthenticated
  );

  // Reset sort option if current selection requires auth but user is not authenticated
  useEffect(() => {
    if (isAuthenticated === undefined) return;
    let currentOption = {};
    const noAuthOptions = sortOptionsConfig.filter((option) => {
      if (option.id === sortBy) {
        currentOption = option;
      }
      if (!option.requiresAuth) {
        return option;
      }
    });
    if (currentOption?.requiresAuth && !isAuthenticated) {
      if (noAuthOptions.length > 0) {
        const firstOption = noAuthOptions[0];
        if (searchParam && setSearchParams) {
          setSearchParams({ [searchParam]: firstOption.id });
        }
        setSortBy(firstOption.id);
        setLabel(firstOption.label);
        return;
      }
      setSortBy(null);
      setLabel(null);
    }
  }, [isAuthenticated, sortBy, sortOptionsConfig]);

  // Handle sorting/filtering
  const handleSortChange = ({ sortType, label }) => {
    if (searchParam && setSearchParams) {
      setSearchParams({ [searchParam]: sortType });
    }
    setSortBy(sortType);
    setLabel(label);
    setShowSortDropdown(false);
  };

  // Get empty state messages for current sort option
  const emptyStateMessages = useMemo(() => {
    const option =
      sortOptionsConfig.find((opt) => opt.id === sortBy) ||
      sortOptionsConfig[0];
    return {
      title: option.emptyStateTitle,
      message: option.emptyStateMessage,
    };
  }, [sortBy, sortOptionsConfig]);

  // SortByComponent
  const SortByComponent = () => (
    <div className="relative">
      <button
        onClick={() => setShowSortDropdown(!showSortDropdown)}
        className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-900 bg-white dark:bg-neutral-100 border border-neutral-200 dark:border-neutral-100 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 dark:hover:text-neutral-100 transition-colors duration-150 ease-in-out"
      >
        <span>{currentSortOption.label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            showSortDropdown ? "rotate-180" : ""
          }`}
        />
      </button>

      {showSortDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowSortDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-20">
            {availableSortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() =>
                  handleSortChange({ sortType: option.id, label: option.label })
                }
                className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors ${
                  sortBy === option.id
                    ? "text-primary-blue dark:text-neutral-100 font-medium bg-primary-blue/5 dark:bg-neutral-700"
                    : "text-neutral-700 dark:text-neutral-400"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
  const resetSortBy = () => {
    setSortBy(sortOptionsConfig[0].id);
    setLabel(sortOptionsConfig[0].label);
    setShowSortDropdown(false);
  };
  return { sortBy, label, SortByComponent, emptyStateMessages, resetSortBy };
};

export default useSortBy;
