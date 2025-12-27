import React from "react";
import { Button } from "./Button";
import { useSelector } from "react-redux";
import McqResult from "./McqResult";
import CodeResult from "./CodeResult";
const test = {
  id: "cs-101-midterm",
  title: "Introduction to Computer Science",
  description:
    "This assessment covers fundamental concepts of algorithms, data structures, and web technologies. Please ensure you have a stable internet connection. Academic integrity policies apply.",
  policies: {
    allowBack: true,
    canSkip: true,
    timeLimit: "test",
    durationSeconds: 300, // 5 minutes
  },
  questions: [
    {
      id: "q1",
      type: "MCQ",
      text: "Which data structure follows the LIFO (Last In, First Out) principle?",
      options: ["Queue", "Stack", "Linked List", "Binary Tree"],
      correctAnswer: "Stack",
      points: 5,
    },
    {
      id: "q2",
      type: "MULTI_SELECT",
      text: "Select all valid HTTP methods used in RESTful APIs.",
      options: ["GET", "PUSH", "POST", "FETCH", "DELETE"],
      correctAnswer: ["GET", "POST", "DELETE"],
      points: 10,
    },
    {
      id: "q3",
      type: "TEXT",
      text: 'Explain the concept of "Big O Notation" in one sentence.',
      correctAnswer:
        "Big O notation describes the upper bound of an algorithm's runtime or space requirements in terms of input size.",
      points: 15,
    },
    {
      id: "q4",
      type: "MCQ",
      text: "What is the time complexity of accessing an array element by index?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
      correctAnswer: "O(1)",
      points: 5,
    },
  ],
};

const answers = JSON.parse(localStorage.getItem("mock-answers"));
export const TestResultPage = ({ onRestart }) => {
  const { results, questionIdToIndex, questions, questionTypes, submission } =
    useSelector((state) => state.testSession);
  let totalScore = 0;
  let earnedScore = 0;

  test.questions.forEach((q) => {
    totalScore += q.points;
    const userVal = answers[q.id]?.value;
    const isCorrect =
      Array.isArray(q.correctAnswer) && Array.isArray(userVal)
        ? [...q.correctAnswer].sort().join(",") ===
          [...userVal].sort().join(",")
        : q.correctAnswer === userVal;

    if (isCorrect) earnedScore += q.points;
  });

  const percentage = Math.round((earnedScore / totalScore) * 100);

  const gradeColor =
    percentage >= 80
      ? "text-emerald-600 dark:text-emerald-400"
      : percentage >= 60
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-600 dark:text-red-400";

  return (
    <div className="min-h-screen p-4 sm:p-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center transition-colors">
          <h1 className="text-xl font-medium text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wide">
            Assessment Complete
          </h1>
          <div className={`text-6xl sm:text-7xl font-bold mb-4 ${gradeColor}`}>
            {Number(results.score).toFixed(2)}%
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            You scored{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {results.num_correct_answers}
            </span>{" "}
            out of {questions.length} points
          </p>
          {/* <div className="mt-8">
            <Button variant="primary" onClick={onRestart} className="px-8 py-3">
              Return to Start
            </Button>
          </div> */}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white px-1">
            Detailed Review
          </h2>
          {questions.map((question, index) => {
            const questionType = questionTypes[question.question_type_id];
            const currentSubmission = submission[question.id] ?? [];
            const result = results.data[question.id];
            const selectedOptions = Array.isArray(currentSubmission)
              ? new Set(currentSubmission)
              : new Set();
            console.log(result);
            return questionType.type === "mcq" ? (
              <McqResult
                question={question}
                questionNum={index + 1}
                result={result}
                selectedOptions={selectedOptions}
                key={question.body}
              />
            ) : (
              <CodeResult
                question={question}
                questionNum={index + 1}
                result={result}
                currentSubmission={currentSubmission}
                key={question.body}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
