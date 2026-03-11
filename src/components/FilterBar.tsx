import type { Filter, SortKey } from '../types';

interface Props {
  filter: Filter;
  sort: SortKey;
  activeCount: number;
  completedCount: number;
  onFilterChange: (f: Filter) => void;
  onSortChange: (s: SortKey) => void;
  onClearCompleted: () => void;
}

const filterLabels: Record<Filter, string> = {
  all: 'すべて',
  active: '未完了',
  completed: '完了',
};

const sortLabels: Record<SortKey, string> = {
  createdAt: '作成日',
  dueDate: '期限',
  priority: '優先度',
};

export default function FilterBar({
  filter, sort, activeCount, completedCount,
  onFilterChange, onSortChange, onClearCompleted,
}: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Filter tabs */}
      <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
        {(['all', 'active', 'completed'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              filter === f
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {filterLabels[f]}
            {f === 'active' && activeCount > 0 && (
              <span className="ml-1 bg-indigo-100 text-indigo-600 px-1 rounded-full text-xs">
                {activeCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Sort selector */}
      <div className="flex items-center gap-1.5 ml-auto">
        <span className="text-xs text-gray-400">並び替え:</span>
        <select
          value={sort}
          onChange={e => onSortChange(e.target.value as SortKey)}
          className="text-xs text-gray-600 border border-gray-200 rounded px-2 py-1 outline-none hover:border-gray-300 focus:border-indigo-400 transition-colors bg-white"
        >
          {(['createdAt', 'dueDate', 'priority'] as SortKey[]).map(s => (
            <option key={s} value={s}>{sortLabels[s]}</option>
          ))}
        </select>
      </div>

      {/* Clear completed */}
      {completedCount > 0 && (
        <button
          onClick={onClearCompleted}
          className="text-xs text-gray-400 hover:text-red-400 transition-colors"
        >
          完了を削除 ({completedCount})
        </button>
      )}
    </div>
  );
}
