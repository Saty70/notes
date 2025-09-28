import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX, FiSave } from "react-icons/fi";

export const ExpandedNoteView = ({ note, onUpdate, onClose }) => {
  const [currentTitle, setCurrentTitle] = useState(note.title);
  const [currentContent, setContent] = useState(note.content);
  const [isDirty, setIsDirty] = useState(false);

  // This effect ensures that if the underlying note data changes (e.g., from a real-time update),
  // the expanded view reflects it, as long as the user isn't currently editing.
  useEffect(() => {
    if (!isDirty) {
      setCurrentTitle(note.title);
      setContent(note.content);
    }
  }, [note, isDirty]);

  const handleSave = () => {
    onUpdate(note.id, { title: currentTitle, content: currentContent });
    setIsDirty(false);
  };

  // THE FIX (Part 1): A new "close" handler that automatically saves any pending changes.
  const handleClose = () => {
    if (isDirty) {
      handleSave();
    }
    onClose(); // Then calls the original onClose prop to hide the modal.
  };

  // This effect listens for the Escape key to trigger our new smart close handler.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]); // Dependency array updated to use the new handler

  const modalContent = (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      onClick={handleClose} // The backdrop now calls the smart close handler.
    >
      <div
        className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-2xl w-[95vw] h-[90vh] flex flex-col p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <input
            type="text"
            value={currentTitle}
            onChange={(e) => {
              setCurrentTitle(e.target.value);
              setIsDirty(true);
            }}
            className="font-bold text-2xl bg-transparent w-full focus:outline-none text-text-primary-light dark:text-text-primary-dark"
          />
          <div className="flex items-center gap-3">
            {isDirty && (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <FiSave /> Save
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-2 rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        <div className="flex-grow border-t border-gray-200 dark:border-gray-700 pt-4">
          <textarea
            value={currentContent}
            onChange={(e) => {
              setContent(e.target.value);
              setIsDirty(true);
            }}
            className="w-full h-full bg-transparent text-text-primary-light dark:text-text-primary-dark resize-none focus:outline-none text-lg leading-relaxed"
            placeholder="Your note..."
          ></textarea>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
