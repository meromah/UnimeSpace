import React, { useState, useEffect, useMemo } from "react";
import { Button } from "./Button";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import QuestionRenderer from "./QuestionRenderer";
import {
  enterReview,
  goToNextQuestion,
  goToPreviousQuestion,
  resetSession,
} from "../../../app/testSessionSlice";
import { FaTimes } from "react-icons/fa";
import { usePostTestQuitMutation } from "../../../services/testsApi";

export const QuestionRunner = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {descId, testId} = useParams()
  const [quitTest] = usePostTestQuitMutation();
  const { test, questions, currentIndex } = useSelector(
    (state) => state.testSession
  );
  const [answers, setAnswers] = useState({});
  const [disabled, setDisabled] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isQuitModal, setIsQuitModal] = useState(false)
  const handleNext = () => {
    setDisabled(true);

    setTimeout(() => {
      setDisabled(false);

      if (questions.length > currentIndex + 1) {
        dispatch(goToNextQuestion());
      } else {
        dispatch(enterReview());
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      dispatch(goToPreviousQuestion());
    }
  };
  const handleQuit = async()=>{
    try {
      await quitTest({desc: descId, test: testId}).unwrap()
      dispatch(resetSession())
      navigate(-1)
    } catch (err) {
      
    }
  }
  const isLastQuestion = useMemo(
    () => currentIndex === questions.length - 1,
    [currentIndex, questions]
  );

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const isUrgent = timeRemaining < 60;
  const timerStyles = isUrgent
    ? "text-red-700 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900"
    : "text-slate-700 bg-white border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700";
  return (
    <>
      <div className="min-h-screen flex flex-col transition-colors duration-300">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
          <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-[150px] sm:max-w-xs">
                {test.title}
              </h1>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
            {test.duration !== null && (
              <div
                className={`px-3 py-1.5 rounded-md border text-sm font-mono font-medium transition-colors ${timerStyles}`}
              >
                {minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}
              </div>
            )}
            <div
              className="px-5 py-2 font-medium text-red-500 border rounded cursor-pointer hover:bg-red-50"
              onClick={() => setIsQuitModal(true)}
            >
              <p>Quit</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300 ease-out"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </header>
        <main className="flex-1 w-full max-w-3xl mx-auto p-4 sm:p-8 flex flex-col justify-center">
          <QuestionRenderer />
        </main>
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 transition-colors">
          <div className="max-w-3xl mx-auto flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className="w-24"
              disabled={currentIndex === 0}
            >
              Back
            </Button>
            <Button
              variant={isLastQuestion ? "primary" : "secondary"}
              onClick={handleNext}
              disabled={disabled}
              className="w-32 sm:w-40 disabled:animate-pulse appearance-none disabled:opacity-100"
            >
              {isLastQuestion ? "Review and Submit" : "Next"}
            </Button>
          </div>
        </footer>
      </div>
      {isQuitModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm cursor-default"
          onClick={()=> setIsQuitModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={()=> setIsQuitModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1 cursor-pointer disabled:opacity-50"
              aria-label="Close modal"
            >
              <FaTimes className="w-5 h-5" />
            </button>
            
              <div className="p-6">
                {/* Header */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Quit test
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    You have an ongoing test. Are you sure you want to leave?
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={()=> setIsQuitModal(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleQuit}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
                  >
                    Quit
                  </button>
                </div>
              </div>
          </div>
        </div>
      )}
    </>
  );
};
