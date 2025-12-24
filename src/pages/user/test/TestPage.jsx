import { useSelector } from "react-redux";
import { TestInstructions } from "./TestInstructions";
import { QuestionRunner } from "./QuestionRunner";

export const TestPage = () => {
  const { status } = useSelector((s) => s.testSession);
  switch (status) {
    case "idle":
      return <TestInstructions />;

      case 'in_progress':
        return <QuestionRunner />

    default:
      return <TestInstructions />;
  }
};
