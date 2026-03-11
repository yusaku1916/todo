import { useState, useRef, type KeyboardEvent } from 'react';
import type { Priority } from '../types';

interface Props {
  onAdd: (title: string, priority: Priority, dueDate: string | null) => void;
}

const priorityColors: Record<Priority, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

export default function TodoInput({ onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    if (!title.trim()) return;
    onAdd(title, priority, dueDate || null);
    setTitle('');
    setDueDate('');
    inputRef.current?.focus();
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={handleKey}
          placeholder="新しいタスクを入力... (Enter で追加)"
          className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
          autoFocus
        />
        <button
          onClick={submit}
          disabled={!title.trim()}
          className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          追加
        </button>
      </div>
      <div className="flex items-center gap-4 pt-1 border-t border-gray-50">
        {/* Priority selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">優先度</span>
          {(['high', 'medium', 'low'] as Priority[]).map(p => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-all ${
                priority === p
                  ? 'border-transparent text-white ' + priorityColors[p]
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${priority === p ? 'bg-white' : priorityColors[p]}`} />
              {p === 'high' ? '高' : p === 'medium' ? '中' : '低'}
            </button>
          ))}
        </div>
        {/* Due date */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-gray-400">期限</span>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="text-xs text-gray-600 outline-none border border-gray-200 rounded px-2 py-0.5 hover:border-gray-300 focus:border-indigo-400 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
