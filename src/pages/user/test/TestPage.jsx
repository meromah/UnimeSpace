import { useSelector } from "react-redux";
import { TestInstructions } from "./TestInstructions";
import { QuestionRunner } from "./QuestionRunner";
import { ReviewAnswers } from "./ReviewAnswers";
import { EditAnswer } from "./EditAnswer";
import { useNavigate } from "react-router-dom";
import { TestResultPage } from "./TestResultPage";
import { useEffect } from "react";

export const TestPage = () => {
  const navigate = useNavigate();
  const { status, test } = useSelector((s) => s.testSession);
  const { isAuthenticated } = useSelector((s) => s.auth);
  if (isAuthenticated === false && status !== "idle") {
    navigate("/login");
    return null;
  }
  useEffect(() => {
  if (status === "idle" || status === "completed") return;

  const handler = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  window.addEventListener("beforeunload", handler);

  return () => window.removeEventListener("beforeunload", handler);
}, [status]);
  switch (status) {
    case "idle":
      return <TestInstructions />;

    case "in_progress":
      return <QuestionRunner />;

    case "review":
      return <ReviewAnswers />;
    case "edit":
      return <EditAnswer />;


      case 'completed':
        return <TestResultPage />

    default:
      return <TestInstructions />;
  }
};
