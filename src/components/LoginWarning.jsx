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
    <div className={`w-full max-w-2xl mx-auto h-1/2 min-h-fit flex items-center justify-center p-4 ${className}`}>
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-900">{title}</p>
          <p className="mt-1 text-sm text-gray-600">{message}</p>
        </div>
        <button
          onClick={handleClick}
          className="shrink-0 rounded bg-primary-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 cursor-pointer"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default LoginWarning;