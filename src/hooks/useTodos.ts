import { useState, useEffect, useCallback } from 'react';
import type { Todo, Priority } from '../types';

const STORAGE_KEY = 'todos-v1';

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback((title: string, priority: Priority, dueDate: string | null) => {
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      priority,
      dueDate,
      createdAt: Date.now(),
    };
    setTodos(prev => [todo, ...prev]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateTodo = useCallback((id: string, updates: Partial<Pick<Todo, 'title' | 'priority' | 'dueDate'>>) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(t => !t.completed));
  }, []);

  const reorderTodo = useCallback((fromIndex: number, toIndex: number, visibleIds: string[]) => {
    setTodos(prev => {
      const result = [...prev];
      const fromId = visibleIds[fromIndex];
      const toId = visibleIds[toIndex];
      const fromI = result.findIndex(t => t.id === fromId);
      const toI = result.findIndex(t => t.id === toId);
      const [moved] = result.splice(fromI, 1);
      result.splice(toI, 0, moved);
      return result;
    });
  }, []);

  return { todos, addTodo, toggleTodo, deleteTodo, updateTodo, clearCompleted, reorderTodo };
}
