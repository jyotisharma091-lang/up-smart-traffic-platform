import React, { useState } from 'react';
import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import EmptyState from './EmptyState';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  description?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyStateMessage?: string;
  emptyStateSubMessage?: string;
}

export default function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  emptyStateMessage = 'No records found',
  emptyStateSubMessage = 'Try adjusting your filters',
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyStateMessage}
        message={emptyStateSubMessage}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm text-left text-slate-700">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className={clsx('px-4 py-3 whitespace-nowrap', col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {currentData.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={clsx(
                  'bg-white hover:bg-slate-50 transition-colors',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={clsx('px-4 py-3', col.className)}>
                    {col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey] || '') : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 mt-2 bg-white border border-slate-200 rounded-lg">
          <div className="text-sm text-slate-500">
            Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, data.length)}</span> of <span className="font-medium">{data.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
