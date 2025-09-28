import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { FiX, FiShare2, FiTrash2, FiLoader } from "react-icons/fi";
import ReactDOM from "react-dom";

export const CardShareModal = ({ note, isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState("view");
  const [shares, setShares] = useState([]);
  const [loadingShares, setLoadingShares] = useState(true);

  // Effect to fetch the list of people this note is shared with
  useEffect(() => {
    if (isOpen && note.id) {
      setLoadingShares(true);
      const sharesQuery = query(
        collection(db, "shares"),
        where("noteId", "==", note.id)
      );

      const unsubscribe = onSnapshot(
        sharesQuery,
        (snapshot) => {
          const sharesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setShares(sharesData);
          setLoadingShares(false);
        },
        (error) => {
          console.error("Error fetching shares:", error);
          setLoadingShares(false);
        }
      );

      return () => unsubscribe();
    }
  }, [isOpen, note.id]);

  const handleShare = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      const shareId = `${note.id}_${email}`;
      const shareDocRef = doc(db, "shares", shareId);
      await setDoc(shareDocRef, {
        noteId: note.id,
        ownerId: note.ownerId,
        recipientEmail: email,
        accessLevel: accessLevel,
      });
      alert(`Note shared with ${email}!`);
      setEmail("");
    } catch (error) {
      console.error("Error sharing note:", error);
      alert(
        "Could not share the note. This is likely a Firestore permissions issue. Ensure your rules allow creating documents in the 'shares' collection."
      );
    }
  };

  const handleRevoke = async (shareId) => {
    if (
      window.confirm("Are you sure you want to revoke access for this user?")
    ) {
      try {
        await deleteDoc(doc(db, "shares", shareId));
      } catch (error) {
        console.error("Error revoking access:", error);
        alert(
          "Could not revoke access. Please check your Firestore security rules to ensure you have delete permissions."
        );
      }
    }
  };

  const handleUpdateAccess = async (shareId, newLevel) => {
    try {
      await updateDoc(doc(db, "shares", shareId), { accessLevel: newLevel });
    } catch (error) {
      console.error("Error updating access:", error);
      alert(
        "Could not update permission. Please check your Firestore security rules to ensure you have update permissions on the 'shares' collection."
      );
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Share Note: "{note.title}"
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <FiX />
          </button>
        </div>

        <div className="mb-6 border-t border-b border-gray-200 dark:border-gray-700 py-4 overflow-y-auto">
          <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-3 px-1">
            Currently Shared With
          </h3>
          {loadingShares ? (
            <div className="flex justify-center items-center h-24">
              <FiLoader
                className="animate-spin text-primary-DEFAULT"
                size={24}
              />
            </div>
          ) : shares.length > 0 ? (
            <ul className="space-y-3">
              {shares.map((share) => (
                <li
                  key={share.id}
                  className="flex justify-between items-center bg-background-light dark:bg-background-dark p-2 rounded-md"
                >
                  <span
                    className="text-sm text-text-primary-light dark:text-text-primary-dark truncate"
                    title={share.recipientEmail}
                  >
                    {share.recipientEmail}
                  </span>
                  <div className="flex items-center gap-2">
                    <select
                      value={share.accessLevel}
                      onChange={(e) =>
                        handleUpdateAccess(share.id, e.target.value)
                      }
                      className="text-sm bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark border border-gray-300 dark:border-gray-600 rounded-md p-1 focus:ring-1 focus:ring-primary-DEFAULT outline-none"
                    >
                      <option value="view">View</option>
                      <option value="edit">Edit</option>
                    </select>
                    <button
                      onClick={() => handleRevoke(share.id)}
                      className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"
                      title="Revoke access"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark text-center py-4">
              Not shared with anyone yet.
            </p>
          )}
        </div>

        <form onSubmit={handleShare} className="flex-shrink-0">
          <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
            Share with a new person
          </h3>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1"
            >
              Recipient's Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full p-2 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <span className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
              Permission Level
            </span>
            <div className="flex items-center justify-around p-1 bg-background-light dark:bg-background-dark rounded-lg ring-1 ring-inset ring-gray-300 dark:ring-gray-700">
              <label
                htmlFor="view-access"
                className={`w-1/2 text-center p-1.5 rounded-md cursor-pointer transition-colors text-sm font-medium ${
                  accessLevel === "view"
                    ? "bg-primary-DEFAULT text-white"
                    : "text-text-secondary-light dark:text-text-secondary-dark"
                }`}
              >
                <input
                  id="view-access"
                  type="radio"
                  name="access"
                  value="view"
                  checked={accessLevel === "view"}
                  onChange={(e) => setAccessLevel(e.target.value)}
                  className="appearance-none"
                />
                View Only
              </label>
              <label
                htmlFor="edit-access"
                className={`w-1/2 text-center p-1.5 rounded-md cursor-pointer transition-colors text-sm font-medium ${
                  accessLevel === "edit"
                    ? "bg-primary-DEFAULT text-white"
                    : "text-text-secondary-light dark:text-text-secondary-dark"
                }`}
              >
                <input
                  id="edit-access"
                  type="radio"
                  name="access"
                  value="edit"
                  checked={accessLevel === "edit"}
                  onChange={(e) => setAccessLevel(e.target.value)}
                  className="appearance-none"
                />
                Can Edit
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg font-semibold transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-surface-dark"
          >
            <FiShare2 size={18} />
            Add Person
          </button>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

// import { useState } from "react";
// import { db } from "../firebase/config";
// import { doc, setDoc } from "firebase/firestore";
// import { FiX, FiShare2 } from "react-icons/fi";
// import ReactDOM from "react-dom";

// export const CardShareModal = ({ note, isOpen, onClose }) => {
//   const [email, setEmail] = useState("");
//   const [accessLevel, setAccessLevel] = useState("view");

//   if (!isOpen) return null;

//   const handleShare = async (e) => {
//     e.preventDefault();
//     if (!email) return;
//     try {
//       const shareId = `${note.id}_${email}`;
//       const shareDocRef = doc(db, "shares", shareId);
//       await setDoc(shareDocRef, {
//         noteId: note.id,
//         ownerId: note.ownerId,
//         recipientEmail: email,
//         accessLevel: accessLevel,
//       });
//       alert(`Note shared with ${email}!`);
//       onClose();
//       setEmail("");
//     } catch (error) {
//       console.error("Error sharing note:", error);
//       alert("Could not share the note. Please check the console for details.");
//     }
//   };

//   const modalContent = (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
//       onClick={onClose}
//     >
//       <div
//         className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-xl w-full max-w-md"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
//             Share Note: "{note.title}"
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-1 rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700"
//           >
//             <FiX />
//           </button>
//         </div>
//         <form onSubmit={handleShare}>
//           <div className="mb-5">
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1"
//             >
//               Recipient's Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="name@example.com"
//               className="w-full p-2 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent outline-none"
//               required
//             />
//           </div>

//           <div className="mb-6">
//             <span className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
//               Permission Level
//             </span>
//             <div className="flex flex-col gap-3">
//               {/* THE FIX: Switched from 'peer' to direct conditional styling for reliability */}
//               <label
//                 htmlFor="view-access"
//                 className="flex items-center gap-3 cursor-pointer"
//               >
//                 <input
//                   id="view-access"
//                   type="radio"
//                   name="access"
//                   value="view"
//                   checked={accessLevel === "view"}
//                   onChange={(e) => setAccessLevel(e.target.value)}
//                   className="appearance-none"
//                 />
//                 <span
//                   className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors ${
//                     accessLevel === "view"
//                       ? "border-primary-DEFAULT"
//                       : "border-gray-400 dark:border-gray-500"
//                   }`}
//                 >
//                   <span
//                     className={`w-2.5 h-2.5 bg-primary-DEFAULT rounded-full transition-transform ${
//                       accessLevel === "view" ? "scale-100" : "scale-0"
//                     }`}
//                   ></span>
//                 </span>
//                 <span className="text-text-primary-light dark:text-text-primary-dark">
//                   View Only
//                 </span>
//               </label>

//               <label
//                 htmlFor="edit-access"
//                 className="flex items-center gap-3 cursor-pointer"
//               >
//                 <input
//                   id="edit-access"
//                   type="radio"
//                   name="access"
//                   value="edit"
//                   checked={accessLevel === "edit"}
//                   onChange={(e) => setAccessLevel(e.target.value)}
//                   className="appearance-none"
//                 />
//                 <span
//                   className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors ${
//                     accessLevel === "edit"
//                       ? "border-primary-DEFAULT"
//                       : "border-gray-400 dark:border-gray-500"
//                   }`}
//                 >
//                   <span
//                     className={`w-2.5 h-2.5 bg-primary-DEFAULT rounded-full transition-transform ${
//                       accessLevel === "edit" ? "scale-100" : "scale-0"
//                     }`}
//                   ></span>
//                 </span>
//                 <span className="text-text-primary-light dark:text-text-primary-dark">
//                   Can Edit
//                 </span>
//               </label>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg font-semibold transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-surface-dark"
//           >
//             <FiShare2 size={18} />
//             Share Note
//           </button>
//         </form>
//       </div>
//     </div>
//   );

//   return ReactDOM.createPortal(modalContent, document.body);
// };
