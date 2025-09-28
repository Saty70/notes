// src/components/SortableCard.jsx

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "./Card";
// THE FIX: Import the correct icon name, "FiMoreVertical"
import { FiMoreVertical } from "react-icons/fi";

export const SortableCard = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 10 : 0,
  };

  const handle = (
    <button {...listeners} aria-label="Drag handle" className="p-1">
      {/* THE FIX: Use the correct icon here */}
      <FiMoreVertical />
    </button>
  );

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card {...props} handle={handle} />
    </div>
  );
};
