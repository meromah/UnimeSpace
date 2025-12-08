import React, { useEffect, useRef } from "react";
import { BiChevronLeft } from "react-icons/bi";
import RelativeTime from "../../../components/RelativeTime";
import { useDeleteTestMutation, useLazyGetTestFromDescByIdQuery } from "../../../services/testsApi";
import { useLazyGetQuestionsForTestQuery } from "../../../services/questionsApi";

const DraftTestSection = ({
  setDraftTest,
  onShowDrafts,
  draftTests,
  questionTypes,
}) => {
  const closeRef = useRef(null)
  const [getTest] = useLazyGetTestFromDescByIdQuery();
  const [getQuestions] = useLazyGetQuestionsForTestQuery();
  const [deleteDraftTest] = useDeleteTestMutation()
  const onDraftSelect = async (e, item) => {
    e.preventDefault();
    const res_Test = await getTest({
      desc: item.desc.name,
      test: item.id,
    }).unwrap();
    const res_Questions = await getQuestions({
      test: res_Test.data.id,
    }).unwrap();
    const test = {
      desc: item.desc.name,
      description: res_Test.data.description,
      title: res_Test.data.title,
      id: res_Test.data.id,
      questions: [],
    };
    if (res_Questions?.data?.length) {
      for (const question of res_Questions.data) {
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
    setDraftTest(test);
    onShowDrafts(e);
  };
  const onDraftRemove = async (e, item) => {
    e.preventDefault()
    await deleteDraftTest({
      desc: item.desc.name,
      test: item.id,
    }).unwrap()
    setDraftTest(null)
  };
  useEffect(() => {
    if(Array.isArray(draftTests?.data) && draftTests.data.length > 0) return;
    closeRef.current.click()
  }, [draftTests])
  
  return (
    <section className="flex items-start justify-center">
      <div className="w-full flex flex-col gap-4">
        <button
          type="button"
          onClick={onShowDrafts}
          ref={closeRef}
          className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900 focus:outline-none w-fit transition-colors"
        >
          <BiChevronLeft className="text-2xl cursor-pointer" />
          <span className="cursor-pointer">Close</span>
        </button>

        <header>
          <h3 className="text-lg font-semibold text-neutral-900">
            Select a draft test
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Choose one of your saved drafts to load into the form
          </p>
        </header>

        <div className="flex flex-col gap-4">
          {/* Drafts list */}
          <ul className="space-y-3" role="listbox" aria-label="Draft tests">
            {draftTests?.data.map((d) => (
              <li
                key={d.id}
                role="option"
                aria-selected="false"
                data-draft-id={d.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="flex items-baseline gap-1 justify-between md:justify-start">
                        <span className="text-base font-semibold text-neutral-900 truncate">
                          {d.title}
                        </span>
                        <RelativeTime
                          date={d.created_at}
                          className="text-xs font-light opacity-50 whitespace-nowrap"
                        />
                      </p>
                      <p className="text-sm text-neutral-500 line-clamp-2 mt-1">
                        {d.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 md:gap-6">
                  {/* <div className="text-xs text-neutral-400">
                    
                    <span className="block text-neutral-500 mt-0.5">
                      by {d.author?.username}
                    </span>
                  </div> */}

                  <button
                    type="button"
                    onClick={(e) => onDraftRemove(e, d)}
                    className="text-sm font-medium text-red-500 hover:text-red-600 hover:underline focus:outline-none transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={(e) => onDraftSelect(e, d)}
                    className="text-sm px-4 py-2 rounded-md bg-primary-blue text-white hover:bg-primary-blue/90 focus:outline-none focus:ring-2 focus:ring-primary-blue/30 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Select
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DraftTestSection;
