import React, { useEffect } from "react";
import { CheckCircle, Info, X } from "lucide-react";
import { AlertCircle } from "lucide-react";

const Toast = ({ message, type = "success", onClose, time = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, time);

    return () => clearTimeout(timer);
  }, [onClose]);

  const types = {
    success: {
      bg: "bg-green-50 dark:bg-green-900 border-green-500 dark:border-green-700",
      icon: <CheckCircle className="w-6 h-6 text-green-500 dark:text-neutral-200" />,
      text: "text-green-800 dark:text-neutral-200",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-700",
      icon: <Info className="w-6 h-6 text-blue-500 dark:text-neutral-200" />,
      text: "text-blue-800 dark:text-neutral-200",
    },
    error: {
      bg: "bg-red-50 dark:bg-red-900 border-red-500 dark:border-red-700",
      icon: <AlertCircle className="w-6 h-6 text-red-500 dark:text-neutral-200" />,
      text: "text-red-800 dark:text-neutral-200",
    },
  };

  const style = types[type] || types.success;
  return (
    <>
      <div className="fixed top-4 right-4 z-[90] animate-slide-in">
        <div
          className={`${style.bg} border-l-4 rounded-lg shadow-lg p-4 max-w-md flex items-start gap-3`}
        >
          {style.icon}
          <div className="flex-1">
            <p className={`${style.text} font-medium text-sm`}>{message}</p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            className={`${style.text} hover:opacity-70 transition-opacity cursor-pointer`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Toast;
