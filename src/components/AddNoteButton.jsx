// src/components/AddNoteButton.jsx

import { FiPlus } from "react-icons/fi";

// Ensure the word "export" is here
export const AddNoteButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-4 text-black dark:text-white w-14 h-14 rounded-full flex items-center justify-center transition-transform transform hover:scale-110 shadow-md shadow-indigo-400 dark:shadow-blue-200"
      aria-label="Add new note"
    >
      <FiPlus size={28} />
    </button>
  );
};
// Make sure there is NO "export default AddNoteButton;" at the end
