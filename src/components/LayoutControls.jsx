// src/components/LayoutControls.jsx

import { FiGrid } from "react-icons/fi";

export const LayoutControls = ({ activeCols, setLayoutCols }) => {
  // THE CHANGE: Add '1' to the beginning of the array
  const layoutOptions = [1, 2, 3, 4];

  return (
    <div className="flex items-center gap-2 p-2 bg-surface-light dark:bg-surface-dark rounded-lg shadow-sm ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10">
      <FiGrid className="text-text-secondary-light dark:text-text-secondary-dark" />
      {layoutOptions.map((cols) => (
        <button
          key={cols}
          onClick={() => setLayoutCols(cols)}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            activeCols === cols
              ? "bg-primary-DEFAULT text-black dark:text-white shadow shadow-indigo-400 dark:shadow-blue-200"
              : "text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {cols} Col
        </button>
      ))}
    </div>
  );
};
