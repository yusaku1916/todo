import { useState, useRef, type KeyboardEvent } from 'react';
import type { Todo, Priority } from '../types';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Pick<Todo, 'title' | 'priority' | 'dueDate'>>) => void;
  dragHandleProps?: {
    draggable: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragEnd: () => void;
  };
  isDragging?: boolean;
}

const priorityDot: Record<Priority, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

const priorityLabel: Record<Priority, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function isOverdue(dueDate: string | null, completed: boolean): boolean {
  if (!dueDate || completed) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdate, dragHandleProps, isDragging }: Props) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setEditTitle(todo.title);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commitEdit = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== todo.title) {
      onUpdate(todo.id, { title: trimmed });
    } else {
      setEditTitle(todo.title);
    }
    setEditing(false);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') { setEditTitle(todo.title); setEditing(false); }
  };

  const overdue = isOverdue(todo.dueDate, todo.completed);

  return (
    <div
      className={`group flex items-center gap-3 px-4 py-3 bg-white rounded-xl border transition-all ${
        isDragging ? 'opacity-40 scale-95' : 'opacity-100'
      } ${overdue ? 'border-red-200' : 'border-gray-100'} hover:border-gray-200 hover:shadow-sm`}
      {...dragHandleProps}
    >
      {/* Drag handle */}
      <div className="text-gray-300 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity select-none">
        ⠿
      </div>

      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          todo.completed
            ? 'bg-indigo-500 border-indigo-500'
            : 'border-gray-300 hover:border-indigo-400'
        }`}
      >
        {todo.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Priority dot */}
      <div className="relative group/priority flex-shrink-0">
        <span className={`inline-block w-2 h-2 rounded-full ${priorityDot[todo.priority]}`} />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover/priority:flex bg-gray-800 text-white text-xs rounded px-1.5 py-0.5 whitespace-nowrap z-10">
          優先度: {priorityLabel[todo.priority]}
        </div>
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKey}
            className="w-full text-sm outline-none text-gray-800 bg-transparent border-b border-indigo-400"
          />
        ) : (
          <span
            onDoubleClick={startEdit}
            className={`text-sm block truncate cursor-pointer ${
              todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
            title="ダブルクリックで編集"
          >
            {todo.title}
          </span>
        )}
      </div>

      {/* Due date */}
      {todo.dueDate && (
        <span className={`text-xs flex-shrink-0 px-1.5 py-0.5 rounded ${
          overdue ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
        }`}>
          {overdue ? '期限切れ ' : ''}{formatDate(todo.dueDate)}
        </span>
      )}

      {/* Delete button */}
      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 flex-shrink-0"
        title="削除"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
