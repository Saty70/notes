// src/components/CanvasCard.jsx

import { Rnd } from "react-rnd"; // Import the main component from the library
import { Card } from "./Card";

export const CanvasCard = ({ note, onUpdate, onDelete }) => {
  // Provide default values for old notes that don't have these properties
  const size = {
    width: note.width || 320,
    height: note.height || 250,
  };

  const position = {
    x: note.x || 50,
    y: note.y || 50,
  };

  return (
    <Rnd
      size={size}
      position={position}
      minWidth={280}
      minHeight={200}
      bounds="parent" // Keeps the card within the main canvas area
      onDragStop={(e, d) => {
        // When dragging stops, update the note's position in Firestore
        onUpdate(note.id, { x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        // When resizing stops, update the note's size in Firestore
        onUpdate(note.id, {
          width: ref.style.width,
          height: ref.style.height,
          ...position,
        });
      }}
    >
      {/* We render our existing Card component inside. 
          The drag handle is now used by Rnd for positioning. */}
      <Card note={note} onUpdate={onUpdate} onDelete={onDelete} />
    </Rnd>
  );
};
