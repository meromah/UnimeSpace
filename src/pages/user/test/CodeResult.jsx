import React, { useEffect, useRef, useState } from "react";

const CodeResult = ({ question, questionNum, result, currentSubmission }) => {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const isSuccess = new Set();
    for (const item of result) {
      const { error } = item;
      const hasError = error.length > 0;
      const itemSuccess = item.stdout && item.stdout.success
      isSuccess.add(Boolean(itemSuccess && !hasError))
    }
    setSuccess(!isSuccess.has(false))
  }, [result]);

  return (
    <div
      key={question.id}
      className="border border-slate-200 dark:border-slate-800 rounded-lg p-5 bg-white dark:bg-slate-900/30"
    >
      {/* Question header */}
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-base font-medium leading-snug">
          <span className="pr-4 font-medium text-slate-600 dark:text-slate-300">
            {questionNum}.
          </span>
          {question.body}
        </h2>
        {success !== null ? (
          success ? (
            <p className="font-semibold text-green-500 select-none">Correct</p>
          ) : (
            <p className="font-semibold text-red-500 select-none">Incorrect</p>
          )
        ) : null}
      </div>

      {/* Answers */}
      <div className="flex flex-col gap-2">
        <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-md text-sm font-mono">
          {<pre>{currentSubmission}</pre> || (
            <span className="italic text-slate-400">No code submitted</span>
          )}
        </div>
        {result.map((item, i) => {
          const testcase = question.testcases[i];
          const args = testcase.arguments;
          const stdout = item.stdout;
          const hasError = item.error.length > 0;
          const stdSuccess = stdout && stdout.success;
          return hasError ? (
            <div>
              <p>Syntax Error</p>
              <p className="font-medium text-red-400">{item.error}</p>
            </div>
          ) : (
            <div
              key={testcase.id || i}
              className={`flex flex-col gap-2 p-3 border rounded-lg ${
                stdSuccess
                  ? "bg-green-50 border-green-300 text-green-600"
                  : "bg-red-50 border-red-300 text-red-600"
              }`}
            >
              <div className="text-sm font-semibold">Test Case {i + 1}</div>
              <div className="flex flex-col gap-1">
                {args.length > 0 && (
                  <div>
                    <span className="text-xs">Input:</span>
                    <code className="text-xs font-semibold font-mono">
                      {args.map((a) => a.body).join(", ")}
                    </code>
                  </div>
                )}
                {stdSuccess && testcase.expected_output ? (
                  <div>
                    <span className="text-xs">Your Output:</span>
                    <code className="text-xs font-semibold font-mono">
                      {testcase.expected_output}
                    </code>
                  </div>
                ) : !stdSuccess && testcase.expected_output ? (
                  <>
                    <div>
                      <span className="text-xs">Your Output:</span>
                      <code className="text-xs font-semibold font-mono">
                        {item.output}
                      </code>
                    </div>
                    <div>
                      <span className="text-xs">Expected Output:</span>
                      <code className="text-xs font-semibold font-mono">
                        {item.expected}
                      </code>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CodeResult;
