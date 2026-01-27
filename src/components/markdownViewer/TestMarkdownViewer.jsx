import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const TestMarkdownViewer = ({ children }) => {
  const components = {
    // Headings - larger and more prominent for test questions
    h1: ({ node, ...props }) => (
      <h1
        className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 mt-6 first:mt-0 leading-tight"
        {...props}
      />
    ),
    h2: ({ node, ...props }) => (
      <h2
        className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 mt-5 first:mt-0 leading-tight"
        {...props}
      />
    ),
    h3: ({ node, ...props }) => (
      <h3
        className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3 mt-4 first:mt-0 leading-tight"
        {...props}
      />
    ),
    h4: ({ node, ...props }) => (
      <h4
        className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 mt-3 first:mt-0 leading-tight"
        {...props}
      />
    ),
    h5: ({ node, ...props }) => (
      <h5
        className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-2 mt-3 first:mt-0 leading-tight"
        {...props}
      />
    ),
    h6: ({ node, ...props }) => (
      <h6
        className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2 mt-2 first:mt-0 leading-tight"
        {...props}
      />
    ),

    // Paragraph - larger, more visible, better contrast for test questions
    p: ({ node, ...props }) => (
      <p
        className="text-base text-neutral-900 dark:text-neutral-100 mb-4 leading-7 last:mb-0 font-normal"
        {...props}
      />
    ),

    // Span
    span: ({ node, ...props }) => (
      <span
        className="text-base text-neutral-900 dark:text-neutral-100"
        {...props}
      />
    ),

    // Strong (bold) - more prominent
    strong: ({ node, ...props }) => (
      <strong
        className="font-bold text-neutral-900 dark:text-neutral-100"
        {...props}
      />
    ),

    // Emphasis (italic)
    em: ({ node, ...props }) => (
      <em
        className="italic text-neutral-800 dark:text-neutral-200"
        {...props}
      />
    ),

    // Deleted (strikethrough)
    del: ({ node, ...props }) => (
      <del
        className="line-through text-neutral-500 dark:text-neutral-400"
        {...props}
      />
    ),

    // Blockquote - more visible
    blockquote: ({ node, ...props }) => (
      <blockquote
        className="border-l-4 border-primary-blue dark:border-blue-400 pl-4 py-3 my-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-r-lg italic text-neutral-800 dark:text-neutral-200 text-base"
        {...props}
      />
    ),

    // Horizontal rule
    hr: ({ node, ...props }) => (
      <hr
        className="my-6 border-0 border-t-2 border-neutral-300 dark:border-neutral-600"
        {...props}
      />
    ),

    // Lists - larger text and better spacing
    ul: ({ node, ...props }) => (
      <ul
        className="list-disc list-inside mb-4 space-y-2 text-base text-neutral-900 dark:text-neutral-100 ml-4"
        {...props}
      />
    ),
    ol: ({ node, ...props }) => (
      <ol
        className="list-decimal list-inside mb-4 space-y-2 text-base text-neutral-900 dark:text-neutral-100 ml-4"
        {...props}
      />
    ),
    li: ({ node, ...props }) => (
      <li className="leading-7 pl-1" {...props} />
    ),

    // Links - more visible
    a: ({ node, ...props }) => (
      <a
        className="text-primary-blue dark:text-blue-400 hover:text-primary-blue/80 dark:hover:text-blue-300 underline font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-blue/20 dark:focus:ring-blue-400/30 rounded"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),

    // Images
    img: ({ node, ...props }) => (
      <img
        className="max-w-full h-auto rounded-lg my-4 border-2 border-neutral-200 dark:border-neutral-700"
        loading="lazy"
        {...props}
      />
    ),

    // Code blocks - more visible
    pre: ({ node, ...props }) => (
      <pre
        className="bg-neutral-950 dark:bg-neutral-900 
               text-neutral-100 
               rounded-lg p-4 my-4 
               overflow-x-auto 
               text-sm leading-relaxed
               border-2 border-neutral-200 dark:border-neutral-700"
        {...props}
      />
    ),

    code: ({ node, ...props }) => (
      <code
        className="font-mono text-sm bg-neutral-100 dark:bg-neutral-800 
               text-neutral-900 dark:text-neutral-100 
               px-2 py-1 rounded 
               border border-neutral-300 dark:border-neutral-600"
        {...props}
      />
    ),

    // Tables (remark-gfm) - more visible
    table: ({ node, ...props }) => (
      <div className="overflow-x-auto my-4">
        <table
          className="min-w-full border-collapse border-2 border-neutral-200 dark:border-neutral-700 rounded-lg"
          {...props}
        />
      </div>
    ),
    thead: ({ node, ...props }) => (
      <thead className="bg-neutral-50 dark:bg-neutral-800" {...props} />
    ),
    tbody: ({ node, ...props }) => (
      <tbody className="bg-white dark:bg-neutral-900" {...props} />
    ),
    tr: ({ node, ...props }) => (
      <tr
        className="border-b border-neutral-200 dark:border-neutral-700 last:border-b-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
        {...props}
      />
    ),
    th: ({ node, ...props }) => (
      <th
        className="px-4 py-3 text-left text-base font-semibold text-neutral-900 dark:text-neutral-100 border-r border-neutral-200 dark:border-neutral-700 last:border-r-0"
        {...props}
      />
    ),
    td: ({ node, ...props }) => (
      <td
        className="px-4 py-3 text-base text-neutral-700 dark:text-neutral-300 border-r border-neutral-200 dark:border-neutral-700 last:border-r-0"
        {...props}
      />
    ),

    // Task list checkboxes (remark-gfm)
    input: ({ node, ...props }) => {
      if (props.type === "checkbox") {
        return (
          <input
            type="checkbox"
            disabled
            readOnly
            className="mr-2 w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 text-primary-blue dark:text-blue-400 focus:ring-2 focus:ring-primary-blue/20 dark:focus:ring-blue-400/30 cursor-default"
            {...props}
          />
        );
      }
      return <input {...props} />;
    },
  };

  return (
    <Markdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </Markdown>
  );
};

export default TestMarkdownViewer;


