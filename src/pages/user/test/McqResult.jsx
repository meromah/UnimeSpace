import React from "react";

const McqResult = ({question, questionNum, result, selectedOptions}) => {
  return (
    <div
      key={question.id}
      className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 bg-white dark:bg-neutral-900/30"
    >
      {/* Question header */}
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-base font-medium leading-snug">
          <span className="pr-4 font-medium text-neutral-600 dark:text-neutral-300">
            {questionNum}.
          </span>
          {question.body}
        </h2>
        {Array.isArray(result.missed_options) &&
        result.missed_options.length > 0 ? (
          <p className="font-semibold text-red-500 select-none">Missed</p>
        ) : result.success ? (
          <p className="font-semibold text-green-500 select-none">Correct</p>
        ) : (
          <p className="font-semibold text-red-500 select-none">Incorrect</p>
        )}
      </div>

      {/* Answers */}
      <div>
        <div className="space-y-2">
          {question.options.map((option) => {
            const isSelected = selectedOptions.has(option.id);
            const isCorrect = Array.isArray(result.correct_options) && result.correct_options.includes(option.id);
            const isIncorrect = Object.values(
              result.incorrect_options
            ).includes(option.id);
            const isMissed =
              Array.isArray(result.missed_options) &&
              result.missed_options.includes(option.id);

            return (
              <div
                key={option.id}
                className={`flex items-center gap-3 p-2 rounded-md border text-sm transition
                    ${
                      isCorrect
                        ? "border-green-400 bg-green-50 dark:bg-green-950/20"
                        : isIncorrect
                        ? "border-red-400 bg-red-50 dark:bg-red-950/20"
                        : isMissed
                        ? "border-green-400 bg-green-50/50 dark:bg-green-950/10"
                        : "border-neutral-200 dark:border-neutral-800"
                    }`}
              >
                <div
                  className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center transition-colors
                      ${
                        isCorrect
                          ? "border-green-600 bg-green-600"
                          : isIncorrect
                          ? "border-red-600 bg-red-600"
                          : isMissed
                          ? "border-green-600 bg-white dark:bg-neutral-900"
                          : "border-neutral-400"
                      }`}
                >
                  {(isSelected || isMissed) && (
                    <svg
                      className={`w-3 h-3 ${
                        isCorrect
                          ? "text-white"
                          : isIncorrect
                          ? "text-white"
                          : isMissed
                          ? "text-green-600"
                          : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`${
                    isCorrect || isMissed
                      ? "font-medium text-green-700 dark:text-green-400"
                      : isIncorrect
                      ? "font-medium text-red-700 dark:text-red-400"
                      : "text-neutral-600 dark:text-neutral-300"
                  }`}
                >
                  {option.body}
                </span>
                {(isMissed || isCorrect) && (
                  <span className="ml-auto text-xs text-green-600 dark:text-green-400">
                    (Correct answer)
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {/* {questionType?.type === "mcq" && question.options ? (
        ) : questionType?.type === "code" ? (
          <div className="mt-2 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-md text-sm font-mono">
            {<pre>{currentSubmission}</pre> || (
              <span className="italic text-neutral-400">No code submitted</span>
            )}
            {result.map((item, i) => {
              const testcase = question.testcases[i];
              const hasError = result.error.length > 0;
              const stdout = result.stdout;
              console.log(result);
              // const { testcase, success } = question;
              // const args = testcase.arguments;
              return <></>;
              return (
                <div
                  key={testcase.id || i}
                  className={`flex flex-col gap-2 p-3 border rounded-lg ${
                    success
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
                    {success && testcase.expected_output ? (
                      <div>
                        <span className="text-xs">Your Output:</span>
                        <code className="text-xs font-semibold font-mono">
                          {testcase.expected_output}
                        </code>
                      </div>
                    ) : !success && testcase.expected_output ? (
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
        ) : null} */}
      </div>
    </div>
  );
};

export default McqResult;
