import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Header from "../components/Header";
import { AddNoteButton } from "../components/AddNoteButton";
import { Card } from "../components/Card";
import { useNotes } from "../hooks/useNotes";
import { LayoutControls } from "../components/LayoutControls";
import { ExpandedNoteView } from "../components/ExpandedNoteView";

const gridLayoutClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
};

const DashboardPage = () => {
  // Get the master list of notes and functions from our custom hook
  const {
    notes: notesFromHook,
    loading,
    addNote,
    updateNote,
    deleteNote,
  } = useNotes();

  // THE FIX (Part 1): Maintain a local state for notes. This allows us to make
  // "optimistic" UI updates for a faster user experience.
  const [localNotes, setLocalNotes] = useState([]);

  const [layoutCols, setLayoutCols] = useState(3);
  const [expandedNote, setExpandedNote] = useState(null);

  // This effect keeps our local notes in sync with the master list from the database.
  useEffect(() => {
    setLocalNotes(notesFromHook);
  }, [notesFromHook]);

  // This effect ensures the data in the expanded view is always the most up-to-date.
  useEffect(() => {
    if (expandedNote) {
      const latestNoteData = localNotes.find(
        (note) => note.id === expandedNote.id
      );
      if (
        latestNoteData &&
        (latestNoteData.title !== expandedNote.title ||
          latestNoteData.content !== expandedNote.content)
      ) {
        setExpandedNote(latestNoteData);
      }
    }
  }, [localNotes, expandedNote]);

  // THE FIX (Part 2): A single, robust handler for all note updates.
  const handleNoteUpdate = (noteId, updatedData) => {
    // 1. Update the note in Firestore in the background.
    updateNote(noteId, updatedData);

    // 2. Immediately (optimistically) update our local state.
    setLocalNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === noteId ? { ...note, ...updatedData } : note
      )
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <p className="text-center text-text-secondary-light dark:text-text-secondary-dark">
          Loading your notes...
        </p>
      );
    }
    if (localNotes.length === 0) {
      return (
        <div className="text-center text-text-secondary-light dark:text-text-secondary-dark">
          <p>Click the '+' button to create your first note!</p>
        </div>
      );
    }
    return (
      <div className={`grid ${gridLayoutClasses[layoutCols]} gap-6`}>
        {localNotes.map((note) => (
          <Card
            key={note.id}
            note={note}
            // THE FIX (Part 3): Pass the single, robust handler to the Card component.
            onUpdate={handleNoteUpdate}
            onDelete={deleteNote}
            onExpand={setExpandedNote}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark">
      <Header />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-2xl font-semibold text-text-secondary-light dark:text-text-secondary-dark">
              Your Notes
            </h2>
            <LayoutControls
              activeCols={layoutCols}
              setLayoutCols={setLayoutCols}
            />
          </div>
          {renderContent()}
        </div>
      </main>
      <AddNoteButton onClick={addNote} />

      {expandedNote &&
        createPortal(
          <ExpandedNoteView
            note={expandedNote}
            // Also pass the robust handler to the expanded view for consistency.
            onUpdate={handleNoteUpdate}
            onClose={() => setExpandedNote(null)}
          />,
          document.body
        )}
    </div>
  );
};

export default DashboardPage;
