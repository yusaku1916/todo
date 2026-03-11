import { useMemo, useState } from 'react';
import type { Filter, Priority, SortKey, Todo } from './types';
import { useTodos } from './hooks/useTodos';
import TodoInput from './components/TodoInput';
import FilterBar from './components/FilterBar';
import TodoList from './components/TodoList';

const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

function sortTodos(todos: Todo[], sort: SortKey): Todo[] {
  return [...todos].sort((a, b) => {
    if (sort === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
    if (sort === 'dueDate') {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    return b.createdAt - a.createdAt;
  });
}

export default function App() {
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<SortKey>('createdAt');
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo, clearCompleted, reorderTodo } = useTodos();

  const filtered = useMemo(() => {
    const base = filter === 'active'
      ? todos.filter(t => !t.completed)
      : filter === 'completed'
      ? todos.filter(t => t.completed)
      : todos;
    return sortTodos(base, sort);
  }, [todos, filter, sort]);

  const activeCount = useMemo(() => todos.filter(t => !t.completed).length, [todos]);
  const completedCount = useMemo(() => todos.filter(t => t.completed).length, [todos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-lg space-y-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Todo</h1>
          <p className="text-sm text-gray-400 mt-1">
            {activeCount > 0
              ? `${activeCount} 件のタスクが残っています`
              : todos.length > 0
              ? 'すべて完了！'
              : 'タスクを追加しましょう'}
          </p>
        </div>

        {/* Input */}
        <TodoInput onAdd={addTodo} />

        {/* Filter & Sort */}
        {todos.length > 0 && (
          <FilterBar
            filter={filter}
            sort={sort}
            activeCount={activeCount}
            completedCount={completedCount}
            onFilterChange={setFilter}
            onSortChange={setSort}
            onClearCompleted={clearCompleted}
          />
        )}

        {/* List */}
        <TodoList
          todos={filtered}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
          onReorder={reorderTodo}
        />

        {/* Footer hint */}
        {todos.length > 0 && (
          <p className="text-center text-xs text-gray-300 pt-2">
            ダブルクリックでタスクを編集 · ドラッグで並び替え
          </p>
        )}
      </div>
    </div>
  );
}
