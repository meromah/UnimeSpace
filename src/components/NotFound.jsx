import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="relative flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <AlertTriangle
          className="mb-4 h-12 w-12 text-rose-500 dark:text-rose-400"
          aria-hidden="true"
        />

        <h1 className="text-2xl font-semibold text-gray-900 dark:text-neutral-100">
          Page not found
        </h1>

        <p className="mt-2 text-gray-500 dark:text-neutral-400">
          The page you requested doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block text-sm font-medium text-rose-600 dark:text-rose-400 hover:underline"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;


