import { useRef, useState } from 'react';
import type { Todo } from '../types';
import TodoItem from './TodoItem';

interface Props {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Pick<Todo, 'title' | 'priority' | 'dueDate'>>) => void;
  onReorder: (fromIndex: number, toIndex: number, visibleIds: string[]) => void;
}

export default function TodoList({ todos, onToggle, onDelete, onUpdate, onReorder }: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragIndex = useRef<number>(-1);

  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-300">
        <div className="text-4xl mb-2">✓</div>
        <p className="text-sm">タスクがありません</p>
      </div>
    );
  }

  const ids = todos.map(t => t.id);

  return (
    <div className="space-y-2">
      {todos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isDragging={draggingId === todo.id}
          dragHandleProps={{
            draggable: true,
            onDragStart: () => { setDraggingId(todo.id); dragIndex.current = index; },
            onDragOver: (e) => { e.preventDefault(); },
            onDrop: () => {
              if (dragIndex.current !== -1 && dragIndex.current !== index) {
                onReorder(dragIndex.current, index, ids);
              }
              setDraggingId(null);
              dragIndex.current = -1;
            },
            onDragEnd: () => { setDraggingId(null); dragIndex.current = -1; },
          }}
        />
      ))}
    </div>
  );
}
