import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetQuestionTypesQuery } from "../../../services/questionTypesApi";
import { Button } from "./Button";
import Loading from "../../../components/Loading";
import { CheckCircle, Edit3 } from "lucide-react";
import { completeTest, jumpToQuestion } from "../../../app/testSessionSlice";
import { usePostTestSubmitMutation } from "../../../services/testsApi";
import { useParams } from "react-router-dom";

export const ReviewAnswers = () => {
  const { descId, testId } = useParams();
  const { questions, submission, test, questionTypes } = useSelector(
    (state) => state.testSession
  );
  const dispatch = useDispatch();

  const [submitYourAnswers, {isLoading}] = usePostTestSubmitMutation();
  const handleSubmit = async () => {
    try {
      const results = await submitYourAnswers({
        desc: descId,
        test: testId,
        bodyData: {submission},
      }).unwrap();
      dispatch(completeTest({results}))
    } catch (err) {}
  };

  const handleEdit = (questionId, questionIndex) => {
    dispatch(jumpToQuestion({ questionIndex, newStatus: "edit" }));
  };


  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Review Your Answers</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {test.title}
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 w-full max-w-3xl mx-auto p-4 sm:p-6">
        {/* Banner */}
        <div className="mb-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-slate-500 dark:text-slate-400 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Review before submitting</p>
            <p className="text-slate-600 dark:text-slate-400">
              You can edit any answer before final submission.
            </p>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-5">
          {questions.map((question, index) => {
            const questionType = questionTypes[question.question_type_id];
            const currentSubmission = submission[question.id] ?? [];
            const selectedOptions = Array.isArray(currentSubmission)
              ? new Set(currentSubmission)
              : new Set();

            return (
              <div
                key={question.id}
                className="border border-slate-200 dark:border-slate-800 rounded-lg p-5 bg-slate-50/30 dark:bg-slate-900/30"
              >
                {/* Question header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3 flex-1">
                    <span className="w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {index + 1}
                    </span>
                    <h2 className="text-base font-medium leading-snug">
                      {question.body}
                    </h2>
                  </div>
                  <button
                    onClick={() => handleEdit(question.id, index)}
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 border-b border-b-transparent hover:border-b-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* Answers */}
                <div className="pl-11">
                  {questionType?.type === "mcq" && question.options ? (
                    <div className="space-y-2">
                      {question.options.map((option) => {
                        const isSelected = selectedOptions.has(option.id);
                        return (
                          <div
                            key={option.id}
                            className={`flex items-center gap-3 p-2 rounded-md border text-sm transition
                              ${
                                isSelected
                                  ? "border-slate-400 bg-slate-100 dark:bg-slate-800/50"
                                  : "border-slate-200 dark:border-slate-800"
                              }`}
                          >
                            <div
                              className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center transition-colors
                                ${
                                  isSelected
                                    ? "border-slate-600 bg-slate-600"
                                    : "border-slate-400"
                                }`}
                            >
                              {isSelected && (
                                <svg
                                  className="w-3 h-3 text-white"
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
                                isSelected
                                  ? "font-medium text-slate-800 dark:text-slate-100"
                                  : "text-slate-600 dark:text-slate-300"
                              }`}
                            >
                              {option.body}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : questionType?.type === "code" ? (
                    <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-md text-sm font-mono">
                      {<pre>{currentSubmission}</pre> || (
                        <span className="italic text-slate-400">
                          No code submitted
                        </span>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur p-4">
        <div className="max-w-3xl mx-auto flex justify-end">
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-medium"
            disabled={isLoading}
          >
            Submit Test
          </Button>
        </div>
      </footer>
    </div>
  );
};
