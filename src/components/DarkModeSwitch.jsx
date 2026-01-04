import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../app/uiSlice";

const DarkModeSwitch = () => {
  const dispatch = useDispatch();
  const isDark = useSelector(state => state.ui.theme === "dark");

  return (
    <button
      role="switch"
      aria-checked={isDark}
      onClick={() => dispatch(toggleTheme())}
      className="w-full flex dark:bg-neutral-900 items-center justify-between px-4 py-3 text-sm transition-colors duration-200"
    >
      <span className="font-medium text-neutral-700 dark:text-neutral-200">
        Dark Mode
      </span>

      <div
        className="relative w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 bg-neutral-300"
      >
        <span
          className={`w-5 h-5 bg-white dark:bg-neutral-900 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
            isDark ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
    </button>
  );
};

export default DarkModeSwitch;