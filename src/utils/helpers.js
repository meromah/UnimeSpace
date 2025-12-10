export const toQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) {
    return "";
  }
  return `?${new URLSearchParams(params).toString()}`;
};
export const getImage = (e) => {
  const files = Array.from(e.target.files);
  const newImages = files
    .filter((file) => file.type.startsWith("image/"))
    .map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
      isUploading: true,
      error: false,
    }));
  return newImages;
};
export const getFile = (e) => {
  const files = Array.from(e.target.files);
  const newFiles = files
    .filter((file) => !file.type.startsWith("image/"))
    .map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      isUploading: true,
      error: false,
    }));
  return newFiles;
};

export const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
export const getFileUrl = (hash) => {
  const API_BASE_URL = import.meta.env.DEV
    ? "/api"
    : import.meta.env.VITE_API_BASE_URL || "/api";
  return `${API_BASE_URL}/files/${hash}`;
};
export const handleDownload = async (file, e, downloadElement) => {
  e.preventDefault();
  e.stopPropagation();
  downloadElement.disabled = true;
  try {
    const url = getFileUrl(file.hash);

    const response = await fetch(url, {
      method: "GET",
      credentials: "include", // only if your API needs cookies
    });

    if (!response.ok) throw new Error("Failed to download");

    const blob = await response.blob();

    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = file.filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(objectUrl);
    downloadElement.disabled = false;
  } catch (error) {
    downloadElement.disabled = false;
    console.error("Failed to download file:", error);
  }
};

// Helper function to extract error message from API error response
export const extractErrorMessage = (error) => {
  if (!error) return "An unexpected error occurred. Please try again.";
  if (typeof error === "string") return error;
  return (
    error.data?.message ??
    error.data?.error ??
    error.message ??
    error.error ??
    error.response?.data?.message ??
    "An unexpected error occurred. Please try again."
  );
};

export const normalizeDraftTestData = ({ item, testData, questionData, questionTypes }) => {
  const test = {
    desc: item.desc.name,
    description: testData.description,
    title: testData.title,
    id: testData.id,
    questions: [],
  };
  if (Array.isArray(questionData) && questionData.length > 0) {
    for (const question of questionData) {
      switch (question.question_type_id) {
        case questionTypes.code.id:
          const test_cases = [];
          const questionArguments = [];
          for (const testCase of question.testcases) {
            test_cases.push({
              id: testCase.id,
              expected_output: testCase.expected_output,
            });
            if (
              Array.isArray(testCase.arguments) &&
              testCase.arguments.length > 0
            ) {
              for (const a of testCase.arguments) {
                questionArguments.push({
                  id: a.id,
                  value: a.body,
                  order: a.arg_order,
                  test_case_id: a.testcase_id,
                });
              }
            }
          }
          test.questions.push({
            id: question.id,
            type: "code",
            body: question.body,
            signature: {
              id: question.signature.id,
              value: question.signature.signature,
              numberOfArguments: question.signature.arg_nums,
            },
            test_cases,
            arguments: questionArguments,
          });
          break;
        case questionTypes.mcq.id:
          test.questions.push({
            id: question.id,
            type: "mcq",
            body: question.body,
            options: question.options,
          });
          break;
        default:
          break;
      }
    }
  }
  return test;
};
