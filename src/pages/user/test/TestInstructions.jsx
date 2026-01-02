import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetTestFromDescByIdQuery,
  usePostTestStartMutation,
} from "../../../services/testsApi";
import Loading from "../../../components/Loading";
import { Clock, FileText, User, Users } from "lucide-react";
import { useGetQuestionsForTestQuery } from "../../../services/questionsApi";
import { useDispatch, useSelector } from "react-redux";
import { initializeSession, startSession } from "../../../app/testSessionSlice";
import { useGetQuestionTypesQuery } from "../../../services/questionTypesApi";
import Toast from "../../../components/Toast";

export const TestInstructions = () => {
  const { descId, testId } = useParams();
  const [error, setError] = useState({ hasError: false, message: null });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { status } = useSelector((s) => s.testSession);
  const {
    data: testInfo,
    isSuccess: isTestDataSuccess,
    isFetching: isTestDataFetching,
  } = useGetTestFromDescByIdQuery({
    desc: descId,
    test: testId,
  });
  const {
    data: questions,
    isFetching: isQuestionsFetching,
    isSuccess: isQuestionsSuccess,
  } = useGetQuestionsForTestQuery({ test: testId }, { skip: !isAuthenticated });
  const {
    data: questionTypes,
    isFetching: isTypesFetching,
    isSuccess: isTypesSuccess,
  } = useGetQuestionTypesQuery(undefined, { skip: !isAuthenticated });
  const [startTest] = usePostTestStartMutation();
  const onTestStart = async () => {
    if (isAuthenticated === false) {
      sessionStorage.setItem("last-visit", location.pathname)
      navigate("/login")
      return null;
    }
    try {
      await startTest({ desc: descId, test: testId }).unwrap();
      dispatch(startSession());
    } catch (err) {
      setError({ hasError: true, message: err.data.message });
    }
  };
  useEffect(() => {
    if (
      !testInfo?.data ||
      !isTestDataSuccess ||
      !questions?.data ||
      !isQuestionsSuccess ||
      !isTypesSuccess ||
      !questionTypes?.ids_obj
    )
      return;

    if (status === "idle") {
      dispatch(
        initializeSession({
          test: {
            title: testInfo.data.title,
            id: testInfo.data.id,
            duration: testInfo.data.duration,
          },
          questionTypes: questionTypes.ids_obj,
          questions: questions.data,
        })
      );
    }
  }, [
    testInfo,
    isTestDataSuccess,
    questions,
    isQuestionsSuccess,
    isTypesSuccess,
    questionTypes,
    dispatch,
  ]);
  if (isTestDataFetching || isQuestionsFetching || isTypesFetching) {
    return <Loading />;
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-700 dark:from-indigo-900 dark:to-indigo-950 p-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {testInfo.data.title}
            </h1>
            {/* Author and Community Info */}
            <div className="flex items-center gap-4 text-sm text-indigo-100">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>{testInfo.data.author.username}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-indigo-300"></div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{testInfo.data.desc.name}</span>
              </div>
            </div>
          </div>
          {/* Content Section */}
          <div className="p-8 space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                About this test
              </h2>
              {testInfo.data.description !== null ? (
                <p className="flex flex-col gap-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong>Description</strong>
                  <span>{testInfo.data.description}</span>
                </p>
              ) : (
                <p>No description.</p>
              )}
            </div>
            {/* Test Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Duration
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {testInfo.data.duration
                      ? `${testInfo.data.duration} min`
                      : "No limit"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Questions
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {testInfo.data.questions_count}
                  </p>
                </div>
              </div>
            </div>
            {/* Start Button */}
            <div className="pt-2">
              <Button
                onClick={onTestStart}
                fullWidth
                variant="primary"
                className="text-base py-3.5 font-medium cursor-pointer"
              >
                Start Test
              </Button>
              {testInfo.data.duration && (
                <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-3">
                  Timer starts immediately when you begin
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {error.hasError && (
        <Toast
          message={error.message}
          onClose={() => setError({ hasError: false, message: null })}
          key={"test-start-error"}
          time={10000}
          type="error"
        />
      )}
    </>
  );
};
