import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUpdatePostMutation } from "../../../services/postsApi";
import { useUpdateTestMutation } from "../../../services/testsApi";

const EditPostModal = ({ isOpen, onClose, item, community, itemType }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [updatePost, { isLoading: isPostUpdating }] = useUpdatePostMutation();
  const [updateTest, { isLoading: isTestUpdating }] = useUpdateTestMutation();
  useEffect(() => {
    if (isOpen && item) {
      setTitle(item.title || "");
      setBody(item.body || item.description || "");
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, item]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose(e);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!title.trim() || !body.trim()) {
      return;
    }

    try {
      if (itemType === "post") {
        await updatePost({
          board: community,
          post: item.id,
          postData: { title: title.trim(), body: body.trim() },
        }).unwrap();
      } else       if (itemType === "test") {
        await updateTest({
          desc: community,
          test: item.id,
          testData: { title: title.trim(), description: body.trim() },
        }).unwrap();
      }
      onClose(e);
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    if (!isTestUpdating || !isPostUpdating) {
      onClose(e);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm cursor-default"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={isPostUpdating || isTestUpdating}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1 cursor-pointer disabled:opacity-50"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit {itemType}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Update your {itemType} title and content
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Title Input */}
            <label className="flex flex-col gap-2">
              <span className="font-medium text-neutral-800">Title *</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
                className="w-full px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:bg-white dark:focus:bg-neutral-900 focus:border-neutral-300 dark:focus:border-neutral-600 focus:ring-4 focus:ring-neutral-100 dark:focus:ring-0 transition"
                required
                disabled={isPostUpdating || isTestUpdating}
                maxLength={200}
              />
            </label>

            {/* Body Textarea */}
            <label className="flex flex-col gap-2">
              <span className="font-medium text-neutral-800">
                {itemType === "post" ? "Post Body *" : "Test Description *"}
              </span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="What's on your mind?"
                rows={4}
                className="w-full px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:bg-white dark:focus:bg-neutral-900 focus:border-neutral-300 dark:focus:border-neutral-600 focus:ring-4 focus:ring-neutral-100 dark:focus:ring-0 transition resize-none overflow-auto"
                required
                disabled={isPostUpdating || isTestUpdating}
                maxLength={1000}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {body.length}/1000 characters
                </span>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPostUpdating || isTestUpdating}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !body.trim() || isPostUpdating || isTestUpdating}
              className="px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
            >
              {isPostUpdating || isTestUpdating ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
