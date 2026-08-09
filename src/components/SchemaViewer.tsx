import React, { useState } from 'react';
import { Question, DatabaseTableSchema } from '../types';
import { Table, Database, Eye, ChevronDown, ChevronUp } from 'lucide-react';

interface SchemaViewerProps {
  currentQuestion: Question | null;
  customTables?: DatabaseTableSchema[];
}

export const SchemaViewer: React.FC<SchemaViewerProps> = ({
  currentQuestion,
  customTables = [],
}) => {
  const [expandedTable, setExpandedTable] = useState<string | null>(null);

  if (!currentQuestion && customTables.length === 0) return null;

  // Gather all relevant tables
  const mainTable: DatabaseTableSchema = {
    table: currentQuestion?.table || '',
    columns: currentQuestion?.columns || [],
    data: currentQuestion?.data || [],
  };

  const additionalTables = currentQuestion?.additionalTables || [];
  const allTables: DatabaseTableSchema[] = [
    ...(mainTable.table ? [mainTable] : []),
    ...additionalTables,
    ...customTables,
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg">
            <Database className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-slate-200">
            ডেটাবেজ স্কিমা ও টেবিল প্রিভিউ ({allTables.length} টি টেবিল)
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {allTables.map((t) => {
          const isExpanded = expandedTable === t.table || allTables.length === 1;

          return (
            <div
              key={t.table}
              className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden transition-all"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedTable(isExpanded ? null : t.table)}
                className="w-full flex items-center justify-between p-3 bg-slate-900/40 hover:bg-slate-900/80 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Table className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono font-bold text-cyan-300 text-sm">
                    {t.table}
                  </span>
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full font-mono">
                    {t.data.length} rows • {t.columns.length} cols
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                    [{t.columns.join(', ')}]
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Table Data Preview */}
              {isExpanded && (
                <div className="p-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>টেবিলের মূল ডেটা (Data Sample):</span>
                  </div>

                  <div className="overflow-x-auto max-h-48 rounded-lg border border-slate-800/80">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-900 text-slate-400 font-mono font-semibold">
                        <tr>
                          {t.columns.map((col) => (
                            <th
                              key={col}
                              className="p-2 border-r border-slate-800 text-cyan-400"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300 bg-slate-950">
                        {t.data.length === 0 ? (
                          <tr>
                            <td
                              colSpan={t.columns.length}
                              className="p-3 text-center text-slate-500"
                            >
                              কোনো ডেটা নেই
                            </td>
                          </tr>
                        ) : (
                          t.data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-900/40">
                              {t.columns.map((col) => (
                                <td key={col} className="p-2 border-r border-slate-800/60">
                                  {row[col] === null ? (
                                    <span className="text-slate-600 italic">NULL</span>
                                  ) : (
                                    String(row[col])
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
