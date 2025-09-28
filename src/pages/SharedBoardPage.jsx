// src/pages/SharedBoardPage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Card } from "../components/Card"; // Reuse our card component

const SharedBoardPage = () => {
  const { shareCode } = useParams(); // Get the code from the URL
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedNotes = async () => {
      try {
        // 1. Find the user ID associated with the share code
        const qShare = query(
          collection(db, "shareLinks"),
          where("code", "==", shareCode)
        );
        const shareSnap = await getDocs(qShare);

        if (shareSnap.empty) {
          throw new Error("This share link is invalid or has expired.");
        }

        const ownerId = shareSnap.docs[0].data().userId;

        // 2. Fetch all notes for that user ID
        const qNotes = query(
          collection(db, "notes"),
          where("userId", "==", ownerId),
          orderBy("createdAt", "desc")
        );
        const notesSnap = await getDocs(qNotes);
        const notesData = notesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(notesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedNotes();
  }, [shareCode]);

  return (
    <div className="min-h-screen bg-background-light p-8">
      <h1 className="text-4xl font-bold text-center mb-2">Writ...</h1>
      <h2 className="text-xl text-text-secondary-light text-center mb-8">
        A Shared Board
      </h2>

      {loading && <p className="text-center">Loading board...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {notes.map((note) => (
            // Pass isReadOnly to disable editing features
            <Card key={note.id} note={note} isReadOnly={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedBoardPage;
