import React from "react";
import { useNavigate } from "react-router-dom";

const LoginWarning = ({
  message = "You need to log in to perform this action.",
  title = "Login required",
  buttonLabel = "Go to login",
  className = "",
}) => {
    const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div
      className={`w-full max-w-2xl mx-auto h-1/2 min-h-fit flex items-center justify-center p-4 ${className}`}
    >
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 rounded-lg">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-900 dark:text-neutral-100">
            {title}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-neutral-300">
            {message}
          </p>
        </div>
        <button
          onClick={handleClick}
          className="shrink-0 rounded bg-primary-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-900 dark:hover:text-neutral-100 border border-primary-blue dark:border-neutral-100 cursor-pointer"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default LoginWarning;