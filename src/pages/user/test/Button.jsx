import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'px-4 py-2.5 rounded-md font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-blue text-white hover:bg-indigo-800 focus:ring-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500',
    secondary: 'bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-500 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100',
    outline: 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 focus:ring-slate-400 dark:bg-transparent dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:border-slate-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-400',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

