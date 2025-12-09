import React from "react";
import AutoResizeTextarea from "../AutoResizeTextarea";
import Toast from "../../../../components/Toast";

const McqQuestionForm = ({
  question,
  error,
  isSubmitting,
  title = "Multiple Choice Question",
  submitButtonText = "Submit",
  submittingButtonText = "Submitting...",
  onBodyChange,
  onAddOption,
  onRemoveOption,
  onOptionBodyChange,
  onOptionCorrectnessChange,
  onSubmit,
  onCancel,
  onErrorClose,
  isFormValid,
}) => {
  if (!question) return null;

  const { body, options = [] } = question;

  return (
    <main className="fixed inset-0 flex items-start md:items-center justify-center bg-black/30 backdrop-blur-sm z-50 overflow-auto">
      <div className="w-full flex flex-col items-center justify-between min-h-full md:min-h-0 md:max-w-4xl md:max-h-[90vh] p-4 md:p-6 md:border md:border-neutral-200 md:rounded-lg bg-neutral-50 md:my-4 md:overflow-hidden">
        <div className="flex flex-col gap-4 md:gap-6 md:flex-1 min-h-0 w-full">
          <p className="text-base md:text-sm font-medium text-neutral-700">
            {title}
          </p>

          <div className="flex flex-col gap-6 flex-1 min-h-0 md:max-h-[calc(90vh-180px)] md:overflow-y-auto">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-800">
                Question Body <span className="text-red-500">*</span>
              </label>
              <AutoResizeTextarea
                value={body || ""}
                onChange={onBodyChange}
                placeholder="Enter the question description..."
                className="w-full px-3 py-2 text-sm text-neutral-900 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none min-h-[100px]"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-800">
                  Options <span className="text-red-500">*</span>
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="p-3 md:p-4 bg-white border border-neutral-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-neutral-700">
                        Option {index + 1}
                      </span>
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => onRemoveOption(index)}
                          className="text-sm text-red-500 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="text-xs font-medium text-neutral-600 mb-1.5 block">
                          Option Text <span className="text-red-500">*</span>
                        </label>
                        <AutoResizeTextarea
                          value={option.body || ""}
                          onChange={(e) => onOptionBodyChange(index, e.target.value)}
                          placeholder="Enter option text..."
                          className="w-full px-3 py-2 text-sm text-neutral-900 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`correct-${index}`}
                          checked={option.is_correct || false}
                          onChange={() => onOptionCorrectnessChange(index)}
                          className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label
                          htmlFor={`correct-${index}`}
                          className="text-sm font-medium text-neutral-700 cursor-pointer"
                        >
                          Mark as correct answer
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={onAddOption}
                  className="px-3 py-1.5 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 active:bg-blue-100 transition-colors"
                >
                  + Add Option
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-neutral-200 bg-neutral-50">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={!isFormValid || isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? submittingButtonText : submitButtonText}
            </button>
          </div>
        </div>

        {error && onErrorClose && (
          <Toast type="error" message={error} onClose={onErrorClose} />
        )}
      </div>
    </main>
  );
};

export default McqQuestionForm;

