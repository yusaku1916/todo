export type Priority = 'high' | 'medium' | 'low';
export type Filter = 'all' | 'active' | 'completed';
export type SortKey = 'createdAt' | 'dueDate' | 'priority';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: number;
}
