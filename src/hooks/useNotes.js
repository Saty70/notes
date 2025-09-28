import { useState, useEffect } from "react";
import { db, auth } from "../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const useNotes = () => {
  const [ownedNotes, setOwnedNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // This effect combines the separate lists into one final, sorted list for the UI.
  useEffect(() => {
    const combined = [...ownedNotes, ...sharedNotes];
    combined.sort(
      (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
    );
    setNotes(combined);
  }, [ownedNotes, sharedNotes]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        let ownedNotesCache = [];
        let sharedByMeNoteIds = new Set();

        // --- Listener for notes the user OWNS ---
        const ownedNotesQuery = query(
          collection(db, "notes"),
          where("ownerId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const unsubscribeOwned = onSnapshot(ownedNotesQuery, (snapshot) => {
          ownedNotesCache = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            isShared: false,
            accessLevel: "edit",
          }));
          // Merge with the latest share info and update state
          setOwnedNotes(
            ownedNotesCache.map((note) => ({
              ...note,
              isSharedByOwner: sharedByMeNoteIds.has(note.id),
            }))
          );
          setLoading(false);
        });

        // --- Listener for shares CREATED BY the user ---
        // This tells us which of our own notes we have shared with others.
        const createdSharesQuery = query(
          collection(db, "shares"),
          where("ownerId", "==", user.uid)
        );
        const unsubscribeCreatedShares = onSnapshot(
          createdSharesQuery,
          (snapshot) => {
            sharedByMeNoteIds = new Set(
              snapshot.docs.map((doc) => doc.data().noteId)
            );
            // Merge with the latest owned notes info and update state
            setOwnedNotes(
              ownedNotesCache.map((note) => ({
                ...note,
                isSharedByOwner: sharedByMeNoteIds.has(note.id),
              }))
            );
          }
        );

        // --- Listener for notes SHARED WITH the user ---
        const sharedNotesQuery = query(
          collection(db, "shares"),
          where("recipientEmail", "==", user.email)
        );
        const unsubscribeShared = onSnapshot(
          sharedNotesQuery,
          async (snapshot) => {
            const shares = snapshot.docs.map((doc) => doc.data());
            if (shares.length === 0) {
              setSharedNotes([]);
              return;
            }
            const noteIds = shares.map((s) => s.noteId).filter(Boolean);
            if (noteIds.length > 0) {
              const notesQuery = query(
                collection(db, "notes"),
                where("__name__", "in", noteIds)
              );
              const notesSnap = await getDocs(notesQuery);
              const sharedNotesData = notesSnap.docs
                .map((doc) => {
                  const shareInfo = shares.find((s) => s.noteId === doc.id);
                  return shareInfo
                    ? {
                        id: doc.id,
                        ...doc.data(),
                        isShared: true,
                        accessLevel: shareInfo.accessLevel,
                      }
                    : null;
                })
                .filter(Boolean);
              setSharedNotes(sharedNotesData);
            } else {
              setSharedNotes([]);
            }
          }
        );

        // Return a cleanup function to unsubscribe from all listeners
        return () => {
          unsubscribeOwned();
          unsubscribeShared();
          unsubscribeCreatedShares();
        };
      } else {
        setOwnedNotes([]);
        setSharedNotes([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const addNote = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("Cannot add note: No user is signed in.");
      return;
    }
    try {
      await addDoc(collection(db, "notes"), {
        ownerId: user.uid,
        ownerName: user.displayName || user.email || "Unnamed User",
        title: "New Note",
        content: "",
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert(
        "Could not save the note. Please check the console for more details."
      );
    }
  };

  const updateNote = async (id, updatedData) => {
    const noteDoc = doc(db, "notes", id);
    await updateDoc(noteDoc, updatedData);
  };

  const deleteNote = async (id) => {
    const noteDoc = doc(db, "notes", id);
    await deleteDoc(noteDoc);
  };

  return { notes, loading, addNote, updateNote, deleteNote };
};

// import { useState, useEffect } from "react";
// import { db, auth } from "../firebase/config";
// import {
//   collection,
//   query,
//   where,
//   onSnapshot,
//   addDoc,
//   serverTimestamp,
//   doc,
//   updateDoc,
//   deleteDoc,
//   orderBy,
//   getDocs,
// } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";

// export const useNotes = () => {
//   // We will manage the two sources of notes in separate state variables
//   const [ownedNotes, setOwnedNotes] = useState([]);
//   const [sharedNotes, setSharedNotes] = useState([]);
//   const [notes, setNotes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // This effect will run whenever the owned or shared notes change,
//   // and it will create the final combined list.
//   useEffect(() => {
//     // Sort combined notes by creation date, newest first
//     const combined = [...ownedNotes, ...sharedNotes];
//     combined.sort(
//       (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
//     );
//     setNotes(combined);
//   }, [ownedNotes, sharedNotes]);

//   useEffect(() => {
//     const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         // --- Listener for notes the user OWNS ---
//         // THE FIX: Re-added orderBy clause for efficient, database-side sorting.
//         // This requires the Firestore index to be set up correctly.
//         const ownedNotesQuery = query(
//           collection(db, "notes"),
//           where("ownerId", "==", user.uid),
//           orderBy("createdAt", "desc")
//         );
//         const unsubscribeOwned = onSnapshot(
//           ownedNotesQuery,
//           (snapshot) => {
//             const ownedNotesData = snapshot.docs.map((doc) => ({
//               id: doc.id,
//               ...doc.data(),
//               isShared: false,
//               accessLevel: "edit",
//             }));
//             setOwnedNotes(ownedNotesData);
//             setLoading(false); // Stop loading after owned notes have their first result
//           },
//           (error) => {
//             // Added error handling for the snapshot listener
//             console.error("Error fetching owned notes: ", error);
//             setLoading(false);
//           }
//         );

//         // --- Listener for notes SHARED WITH the user ---
//         const sharedNotesQuery = query(
//           collection(db, "shares"),
//           where("recipientEmail", "==", user.email)
//         );
//         const unsubscribeShared = onSnapshot(
//           sharedNotesQuery,
//           async (snapshot) => {
//             const shares = snapshot.docs.map((doc) => doc.data());

//             if (shares.length === 0) {
//               setSharedNotes([]); // Clear shared notes if there are no shares
//               return;
//             }

//             const noteIds = shares.map((s) => s.noteId).filter(Boolean); // Filter out any undefined IDs
//             if (noteIds.length > 0) {
//               const notesQuery = query(
//                 collection(db, "notes"),
//                 where("__name__", "in", noteIds)
//               );
//               const notesSnap = await getDocs(notesQuery);

//               const sharedNotesData = notesSnap.docs
//                 .map((doc) => {
//                   const shareInfo = shares.find((s) => s.noteId === doc.id);
//                   return shareInfo
//                     ? {
//                         // Ensure shareInfo exists before creating the object
//                         id: doc.id,
//                         ...doc.data(),
//                         isShared: true,
//                         accessLevel: shareInfo.accessLevel,
//                       }
//                     : null;
//                 })
//                 .filter(Boolean); // Filter out any null results

//               setSharedNotes(sharedNotesData);
//             } else {
//               setSharedNotes([]);
//             }
//           },
//           (error) => {
//             console.error("Error fetching shared notes: ", error);
//           }
//         );

//         // Return a cleanup function to unsubscribe from all listeners on component unmount
//         return () => {
//           unsubscribeOwned();
//           unsubscribeShared();
//         };
//       } else {
//         // If there's no user, clear all state
//         setOwnedNotes([]);
//         setSharedNotes([]);
//         setLoading(false);
//       }
//     });

//     return () => unsubscribeAuth();
//   }, []);

//   // THE FIX: Added robust error handling and a fallback for the owner's name.
//   const addNote = async () => {
//     const user = auth.currentUser;
//     if (!user) {
//       console.error("Cannot add note: No user is signed in.");
//       return;
//     }
//     try {
//       await addDoc(collection(db, "notes"), {
//         ownerId: user.uid,
//         ownerName: user.displayName || user.email || "Unnamed User",
//         title: "New Note",
//         content: "",
//         createdAt: serverTimestamp(),
//       });
//     } catch (error) {
//       console.error("Error adding document: ", error);
//       // Use a custom modal in a real app, but alert is good for debugging
//       alert(
//         "Could not save the note. Please check the console for more details."
//       );
//     }
//   };

//   const updateNote = async (id, updatedData) => {
//     const noteDoc = doc(db, "notes", id);
//     await updateDoc(noteDoc, updatedData);
//   };

//   const deleteNote = async (id) => {
//     const noteDoc = doc(db, "notes", id);
//     await deleteDoc(noteDoc);
//   };

//   return { notes, loading, addNote, updateNote, deleteNote };
// };
