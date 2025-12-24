import { useSelector } from "react-redux";
import { TestInstructions } from "./TestInstructions";

export const TestPage = () => {
  const { status } = useSelector((s) => s.testSession);
  switch (status) {
    case "idle":
      return <TestInstructions />;
    default:
      return <TestInstructions />;
  }
};
