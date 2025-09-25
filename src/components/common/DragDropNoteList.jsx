import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableNoteCard } from "./SortableNoteCard.jsx";

export const DragDropNoteList = ({ 
  notes, 
  onReorder, 
  onUpdate, 
  onDelete,
  onToggleCompletion,
  onToggleArchived,
  onToggleImportant 
}) => {
  const [activeId, setActiveId] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = notes.findIndex((note) => note.id === active.id);
    const newIndex = notes.findIndex((note) => note.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = arrayMove(notes, oldIndex, newIndex);
      
      // Create update payload for backend
      const updates = newOrder.map((note, index) => ({
        id: note.id,
        order: index
      }));

      onReorder(newOrder, updates);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={notes.map(note => note.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="drag-drop-note-list">
          {notes.map((note) => (
            <SortableNoteCard
              key={note.id}
              note={note}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onToggleCompletion={onToggleCompletion}
              onToggleArchived={onToggleArchived}
              onToggleImportant={onToggleImportant}
              isDragging={activeId === note.id}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};