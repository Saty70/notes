import { useState, useEffect } from "react";
import {
  FiSave,
  FiTrash2,
  FiShare2,
  FiUsers,
  FiMaximize,
} from "react-icons/fi";
import { CardShareModal } from "./CardShareModal";
import ReactDOM from "react-dom";

// The "handle" prop has been removed from the function signature
export const Card = ({ note, onUpdate, onDelete, onExpand }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isDirty, setIsDirty] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setIsDirty(false); // Reset dirty state on external update
  }, [note.title, note.content]); // Re-runs whenever the note data from the dashboard changes

  // Determine if the current user has permission to edit this card.
  const isEditable = note.accessLevel === "edit";

  const handleUpdate = () => {
    if (!isEditable) return;
    onUpdate(note.id, { title, content });
    setIsDirty(false);
  };

  const handleDelete = () => {
    if (note.isShared) return;
    if (window.confirm(`Are you sure you want to delete "${note.title}"?`)) {
      onDelete(note.id);
    }
  };

  const creationDate = note.createdAt?.toDate().toLocaleString() || "Just now";

  // The card is "active" if it's being edited or has unsaved changes.
  const isActive = isFocused || isDirty;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const cardContent = (
    <div
      className={`relative bg-surface-light dark:bg-surface-dark rounded-lg p-4 flex flex-col h-[85vh] ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 transition-all duration-200 
      ${
        isActive
          ? "shadow-md shadow-indigo-500 dark:shadow-blue-200"
          : "shadow-md"
      }`}
    >
      {/* SHARED MARKER: Display a pill if the note is shared with the current user */}
      {note.isShared && (
        <div className="flex items-center gap-1 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full w-fit">
          <FiUsers size={12} />
          <span>Shared by {note.ownerName}</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-2 gap-2">
        {/* The Drag Handle div has been completely removed from here */}
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setIsDirty(true);
          }}
          readOnly={!isEditable}
          disabled={!isEditable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="font-bold text-lg bg-transparent w-full focus:outline-none text-text-primary-light dark:text-text-primary-dark disabled:cursor-not-allowed w-fit"
          placeholder="Note Title"
        />

        <div className="flex items-center gap-2 flex-shrink-0">
          {isEditable && (
            <>
              <button
                onClick={() => onExpand(note)}
                onMouseDown={(e) => e.stopPropagation()}
                className="text-gray-500 hover:text-gray-400"
                aria-label="Expand note"
              >
                <FiMaximize />
              </button>
              {isDirty && (
                <button
                  onClick={handleUpdate}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="text-green-500 hover:text-green-400"
                  aria-label="Save note"
                >
                  <FiSave />
                </button>
              )}
              {/* DELETE & SHARE BUTTONS: Only show to the original owner */}

              {!note.isShared && (
                <>
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    onMouseDown={(e) => e.stopPropagation()}
                    className={`transition-colors ${
                      note.isSharedByOwner
                        ? "text-green-500 hover:text-green-400"
                        : "text-blue-500 hover:text-blue-400"
                    }`}
                    aria-label="Share note"
                  >
                    <FiShare2 />
                  </button>
                  <button
                    onClick={handleDelete}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="text-red-500 hover:text-red-400"
                    aria-label="Delete note"
                  >
                    <FiTrash2 />
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
        {creationDate}
      </p>

      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setIsDirty(true);
        }}
        readOnly={!isEditable}
        disabled={!isEditable}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="flex-grow bg-transparent w-full focus:outline-none text-text-primary-light dark:text-text-primary-dark resize-none disabled:cursor-not-allowed"
        placeholder="Your note..."
      ></textarea>
    </div>
  );

  return (
    <>
      {cardContent}
      {isShareModalOpen &&
        ReactDOM.createPortal(
          <CardShareModal
            note={note}
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
          />,
          document.body
        )}
    </>
  );
};
