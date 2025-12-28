import React, { useEffect, useMemo, useRef, useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import { useCheckOldDsaQuestionApiMutation } from "../../../services/solutionsApi";
import { useDispatch, useSelector } from "react-redux";
import {
  initializeSubmission,
  setSubmission,
} from "../../../app/testSessionSlice";

const RenderCodeQuestion = ({ onError }) => {
  const dispatch = useDispatch();
  const { questions, currentIndex, submission } = useSelector(
    (state) => state.testSession
  );
  const timeoutRef = useRef(null);
  const question = useMemo(
    () => questions[currentIndex],
    [questions, currentIndex]
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const [pythonCode, setPythonCode] = useState("");
  const [pythonOutput, setPythonOutput] = useState([]);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [playPython] = useCheckOldDsaQuestionApiMutation();
  const [error, setError] = useState({
    hasError: false,
    message: null,
  });
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isExpanded]);
  useEffect(() => {
    if (submission[question.id]) return;
    dispatch(
      initializeSubmission({
        question_id: question.id,
        question_type: "code",
        value: `def ${question.signature.signature}(${Array.from({
          length: question.signature.arg_nums,
        })
          .map((_, i) => `arg${i + 1}`)
          .join(", ")}):\n\t# Write your solution here`,
      })
    );
  }, [question, dispatch]);
  useEffect(() => {
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      dispatch(
        setSubmission({
          question_id: question.id,
          question_type: "code",
          code: pythonCode,
        })
      );
    }, 300);
    return () => clearTimeout(timeoutRef.current);
  }, [pythonCode, dispatch]);
  useEffect(() => {
    if (submission && submission[question.id]) {
      setPythonCode(submission[question.id]);
    }
  }, [question, submission]);
  useEffect(() => {
    setPythonOutput([]);
    setError({hasError: false, message: null})
  }, [question]);

  const handleRunCode = async () => {
    if (!pythonCode.trim()) return;
    setIsRunningCode(true);
    setPythonOutput([]);
    dispatch(
      setSubmission({
        question_id: question.id,
        question_type: "code",
        code: pythonCode,
      })
    );
    try {
      const { data } = await playPython({
        bodyData: { user_solution: pythonCode, question_id: question.id },
      }).unwrap();
      const result = [];
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (element.error.length > 0) {
          throw new Error(element.error);
        }
        const testcase = question.testcases[i];
        result.push({ ...element.stdout, testcase });
      }
      setPythonOutput(result || []);
      setError({hasError: false, message: null})
    } catch (err) {
      setError({
        hasError: true,
        message: err.message || "Error running code",
      });
    } finally {
      setIsRunningCode(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const el = e.target;
      const start = el.selectionStart;
      const end = el.selectionEnd;

      const TAB = "\t";

      const newValue =
        pythonCode.substring(0, start) + TAB + pythonCode.substring(end);

      setPythonCode(newValue);

      // Move cursor after inserted tab
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = start + TAB.length;
      }, 0);
    }
  };
  return (
    <div
      className={`w-full bg-white flex flex-col overflow-hidden ${
        isExpanded
          ? "fixed inset-0 z-50 "
          : "rounded-2xl border border-neutral-200 max-h-full h-full"
        // : "rounded-2xl border border-neutral-200 min-h-[80vh] max-h-[90vh] "
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900">
          Code Question
        </h2>
        {isExpanded ? (
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <Minimize className="text-2xl" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <Maximize className="text-2xl" />
          </button>
        )}
      </div>
      {/* Content - Two Pane Layout */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Left Pane - Question Details */}
        <div className="w-full md:w-1/2 p-4 md:p-6 overflow-y-auto border-r border-neutral-200">
          <div className="flex flex-col gap-4">
            {/* Question Body */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 mb-2">
                Problem Description
              </h3>
              <p className="text-sm text-neutral-900 whitespace-pre-wrap">
                {question.body || "No description provided"}
              </p>
            </div>
            {/* Function Signature */}
            {question.signature && (
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-2">
                  Function Signature
                </h3>
                <code className="block px-3 py-2 bg-neutral-50 border border-neutral-200 rounded text-sm text-neutral-900 font-mono">
                  def {question.signature.signature}(
                  {Array.from({
                    length: question.signature.arg_nums,
                  })
                    .map((_, i) => `arg${i + 1}`)
                    .join(", ")}
                  ):
                </code>
              </div>
            )}
            {/* Test Cases */}
            {question.testcases && question.testcases.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-2">
                  Test Cases
                </h3>
                <div className="flex flex-col gap-3">
                  {question.testcases.map((testCase, tcIndex) => {
                    const args = testCase.arguments;
                    return (
                      <div
                        key={testCase.id || tcIndex}
                        className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg"
                      >
                        <div className="text-xs font-medium text-neutral-600 mb-2">
                          Test Case {tcIndex + 1}
                        </div>
                        {args.length > 0 && (
                          <div className="mb-2">
                            <span className="text-xs text-neutral-600">
                              Input:{" "}
                            </span>
                            <code className="text-xs text-neutral-900 font-mono">
                              {args.map((a) => a.body).join(", ")}
                            </code>
                          </div>
                        )}
                        <div>
                          <span className="text-xs text-neutral-600">
                            Expected Output:{" "}
                          </span>
                          <code className="text-xs text-neutral-900 font-mono">
                            {testCase.expected_output || "N/A"}
                          </code>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Right Pane - Python Playground */}
        <div className="w-full md:w-1/2 p-4 md:p-6 overflow-y-auto bg-neutral-50">
          <div className="flex flex-col gap-4 h-full">
            <h3 className="text-sm font-semibold text-neutral-700">
              Python Playground
            </h3>
            <textarea
              value={pythonCode}
              onChange={(e) => setPythonCode(e.target.value)}
              placeholder="# Write your Python code here"
              className="flex-1 w-full p-4 rounded-lg font-mono text-sm bg-white border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue resize-none"
              style={{ minHeight: "200px" }}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={handleRunCode}
              disabled={isRunningCode || !pythonCode.trim()}
              className="px-4 py-2 text-sm bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isRunningCode ? "Running..." : "Run Code"}
            </button>
            {error.hasError ? (
              <div
                className="flex flex-col gap-2 p-3 border rounded-lg bg-red-50 border-red-300 text-red-600"
              >
                <h1 className="text-sm font-semibold">Syntax Error</h1>
                <p>{error.message}</p>
              </div>
            ) : null}
            {pythonOutput.length > 0 ? (
              <section className="space-y-2">
                <h2 className="font-medium text-neutral-800 text-lg">
                  {pythonOutput.length > 1 ? "Outputs" : "Output"}
                </h2>
                {pythonOutput.map((item, i) => {
                  const { testcase, success } = item;
                  const args = testcase.arguments;
                  return (
                    <div
                      key={testcase.id || i}
                      className={`flex flex-col gap-2 p-3 border rounded-lg ${
                        success
                          ? "bg-green-50 border-green-300 text-green-600"
                          : "bg-red-50 border-red-300 text-red-600"
                      }`}
                    >
                      <div className="text-sm font-semibold">
                        Test Case {i + 1}
                      </div>
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
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderCodeQuestion;
