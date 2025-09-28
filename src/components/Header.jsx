import { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { FiSun, FiMoon, FiLogOut } from "react-icons/fi";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();

  // State to manage the dropdown's visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // This effect closes the dropdown if you click outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      {/* Import for the "Special Elite" Google Font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
        `}
      </style>
      <header className="p-4 bg-surface-light dark:bg-surface-dark shadow-md flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-5xl font-['Special_Elite'] font-weight-900 text-primary-DEFAULT cursor-default">
          Writ...
        </h1>
        <div className="flex items-center gap-4">
          {currentUser && (
            // The profile section is now a relative container for the dropdown
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2"
              >
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="w-9 h-9 rounded-full border-2 border-primary-DEFAULT"
                />
              </button>

              {/* The Dropdown Menu */}
              <div
                className={`absolute top-full right-0 mt-2 w-56 bg-surface-light dark:bg-surface-dark rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-200 origin-top-right
                  ${
                    isDropdownOpen
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-semibold text-text-primary-light dark:text-text-primary-dark truncate">
                    {currentUser.displayName}
                  </p>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark truncate">
                    {currentUser.email}
                  </p>
                </div>
                <div className="py-2">
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-text-primary-light dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {theme === "light" ? (
                      <FiMoon size={18} />
                    ) : (
                      <FiSun size={18} />
                    )}
                    <span>{theme === "light" ? "Dark" : "Light"} Mode</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50"
                  >
                    <FiLogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;

// import { useState, useEffect, useRef } from "react";
// import { useTheme } from "../context/ThemeContext";
// import { useAuth } from "../context/AuthContext";
// import { auth } from "../firebase/config";
// import { signOut } from "firebase/auth";
// import { FiSun, FiMoon, FiLogOut, FiChevronDown } from "react-icons/fi";

// const Header = () => {
//   const { theme, toggleTheme } = useTheme();
//   const { currentUser } = useAuth();

//   // State to manage the dropdown's visibility
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // This effect closes the dropdown if you click outside of it
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error("Error signing out:", error);
//     }
//   };

//   return (
//     <>
//       <header className="p-4 bg-surface-light dark:bg-surface-dark shadow-md flex justify-between items-center sticky top-0 z-20">
//         <h1 className="text-2xl font-bold text-primary-DEFAULT">Writ...</h1>
//         <div className="flex items-center gap-4">
//           {currentUser && (
//             // The profile section is now a relative container for the dropdown
//             <div className="relative" ref={dropdownRef}>
//               <button
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="flex items-center gap-2"
//               >
//                 <img
//                   src={currentUser.photoURL}
//                   alt="Profile"
//                   className="w-9 h-9 rounded-full border-2 border-primary-DEFAULT"
//                 />
//                 {/* <FiChevronDown
//                   className={`transition-transform duration-200 ${
//                     isDropdownOpen ? "rotate-180" : ""
//                   }`}
//                 /> */}
//               </button>

//               {/* The Dropdown Menu */}
//               <div
//                 className={`absolute top-full right-0 mt-2 w-56 bg-surface-light dark:bg-surface-dark rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-200 origin-top-right
//                   ${
//                     isDropdownOpen
//                       ? "opacity-100 scale-100"
//                       : "opacity-0 scale-95 pointer-events-none"
//                   }`}
//               >
//                 <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                   <p className="font-semibold text-text-primary-light dark:text-text-primary-dark truncate">
//                     {currentUser.displayName}
//                   </p>
//                   <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark truncate">
//                     {currentUser.email}
//                   </p>
//                 </div>
//                 <div className="py-2">
//                   <button
//                     onClick={toggleTheme}
//                     className="w-full flex items-center gap-3 px-4 py-2 text-left text-text-primary-light dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-700"
//                   >
//                     {theme === "light" ? (
//                       <FiMoon size={18} />
//                     ) : (
//                       <FiSun size={18} />
//                     )}
//                     <span>{theme === "light" ? "Dark" : "Light"} Mode</span>
//                   </button>
//                   <button
//                     onClick={handleLogout}
//                     className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50"
//                   >
//                     <FiLogOut size={18} />
//                     <span>Logout</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </header>
//     </>
//   );
// };

// export default Header;
