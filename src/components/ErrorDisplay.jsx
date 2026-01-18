import React from "react";
import { AlertCircle } from "lucide-react";

function extractErrorParts(error) {
  if (!error) return { status: undefined, message: undefined };
  if (typeof error === "string") return { status: undefined, message: error };

  const status = error.status ?? error.code ?? error.response?.status;
  const message =
    error.data?.message ??
    error.data?.error ??
    error.message ??
    error.error ??
    error.response?.data?.message ??
    undefined;

  return { status, message };
}

const ErrorDisplay = ({ error, title = "Something went wrong" }) => {
  const { status, message } = extractErrorParts(error);

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="mx-4 w-full max-w-xl rounded-lg border border-rose-100 dark:border-rose-700 bg-rose-50 dark:bg-transparent p-5">
        <div className="flex items-start gap-3">
          <AlertCircle
            className="mt-0.5 h-6 w-6 shrink-0 text-rose-600"
            aria-hidden="true"
          />
          <div className="flex-1">
            <h2 className="text-base font-semibold text-rose-800 dark:text-neutral-100">
              {title}
            </h2>
            <p className="mt-1 text-sm text-rose-700 dark:text-neutral-200">
              {message || "An unexpected error occurred. Please try again."}
            </p>
            {status !== undefined && (
              <p className="mt-2 text-xs text-rose-600 dark:text-rose-300">
                Status: {status}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;

