import React, { useState, useRef, useEffect } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { useSelector } from "react-redux";

const PostMenu = ({
  itemType = "post",
  item,
  onEdit,
  onDelete,
  onReport,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const { profileData } = useSelector((state) => state.myProfile);

  // Check if current user is the item author
  const isAuthor =
    profileData &&
    (profileData.id === item.author_id ||
      profileData.username === item.author?.username ||
      profileData.id === item.author?.id);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleMenuAction = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    if (action) {
      action(e);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="p-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 cursor-pointer"
        aria-label="Post options"
        aria-expanded={isOpen}
      >
        <HiDotsVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 min-w-[180px]"
          onClick={(e) => e.stopPropagation()}
        >
          {isAuthor ? (
            <>
              <button
                role="menuitem"
                onClick={(e) => handleMenuAction(e, onEdit)}
                className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors duration-150"
              >
                Edit {itemType}
              </button>

              {/* Divider for visual grouping */}
              <div className="my-1 border-t border-gray-200"></div>

              <button
                role="menuitem"
                onClick={(e) => handleMenuAction(e, onDelete)}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
              >
                Delete {itemType}
              </button>
            </>
          ) : (
            <button
              role="menuitem"
              onClick={(e) => handleMenuAction(e, onReport)}
              className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors duration-150"
            >
              Report {itemType}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PostMenu;
