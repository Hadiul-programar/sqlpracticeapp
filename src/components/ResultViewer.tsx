import React, { useState } from 'react';
import { QueryResult } from '../types';
import { CheckCircle2, AlertTriangle, Sparkles, Clock, Table, SearchX, RefreshCw } from 'lucide-react';

interface ResultViewerProps {
  result: QueryResult | null;
  correctnessMessage?: { isCorrect: boolean; message: string } | null;
  onAskAiForHelp?: (errorMsg: string) => void;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({
  result,
  correctnessMessage,
  onAskAiForHelp,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!result) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 shadow-xl text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto">
          <Table className="w-6 h-6" />
        </div>
        <h3 className="text-slate-300 font-semibold text-sm">কোনো রেজাল্ট নেই</h3>
        <p className="text-slate-500 text-xs max-w-sm mx-auto">
          SQL রান করতে উপরে কোড লিখে &quot;Run SQL&quot; বাটনে চাপুন বা Ctrl+Enter চাপুন।
        </p>
      </div>
    );
  }

  // Filter rows if user types search term
  const filteredValues = result.values.filter((row) =>
    row.some((val) =>
      String(val ?? '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
            <Table className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-slate-200">কোয়েরি ফলাফল (Query Result)</span>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{result.executionTimeMs} ms</span>
          </span>

          <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-cyan-400 font-mono font-bold">
            মোট {result.rowCount} সারি (Rows)
          </span>
        </div>
      </div>

      {/* Correctness / Feedback Message Banner */}
      {correctnessMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-3 animate-fadeIn ${
            correctnessMessage.isCorrect
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}
        >
          {correctnessMessage.isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-xs sm:text-sm leading-relaxed space-y-2">
            <p className="font-semibold">{correctnessMessage.message}</p>

            {!correctnessMessage.isCorrect && onAskAiForHelp && (
              <button
                onClick={() =>
                  onAskAiForHelp(
                    result.error || correctnessMessage.message
                  )
                }
                className="flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>এআই টিউটরের কাছে ভুলের ব্যাখ্যা চান</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {result.error ? (
        <div className="bg-rose-950/50 border border-rose-500/40 p-4 rounded-xl text-rose-300 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>SQL ত্রুটি (Syntax / Logic Error):</span>
          </div>
          <p className="font-mono bg-slate-950/80 p-3 rounded-lg border border-rose-900 text-rose-200 overflow-x-auto">
            {result.error}
          </p>

          {onAskAiForHelp && (
            <button
              onClick={() => onAskAiForHelp(result.error!)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition-all mt-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>বাংলা এআই দিয়ে ত্রুটি ঠিক করুন</span>
            </button>
          )}
        </div>
      ) : result.columns.length === 0 ? (
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center text-slate-400 text-xs sm:text-sm">
          ✅ SQL কোয়েরি সফলভাবে এক্সিকিউট হয়েছে, কিন্তু প্রদর্শনের মতো কোনো সারি (Result Set) পাওয়া যায়নি।
        </div>
      ) : (
        /* Result Table with Search Filter */
        <div className="space-y-2">
          {result.rowCount > 5 && (
            <div className="flex justify-end">
              <input
                type="text"
                placeholder="রেজাল্টে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-cyan-500 w-48"
              />
            </div>
          )}

          <div className="overflow-x-auto max-h-72 rounded-xl border border-slate-800 bg-slate-950 scrollbar-thin scrollbar-thumb-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-cyan-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-2.5 border-r border-slate-800 text-slate-600 w-10 text-center">#</th>
                  {result.columns.map((col) => (
                    <th key={col} className="p-2.5 border-r border-slate-800/80 font-mono">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {filteredValues.length === 0 ? (
                  <tr>
                    <td
                      colSpan={result.columns.length + 1}
                      className="p-6 text-center text-slate-500"
                    >
                      <SearchX className="w-5 h-5 mx-auto mb-1 opacity-50" />
                      কোনো ফলাফল মেলেনি
                    </td>
                  </tr>
                ) : (
                  filteredValues.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="hover:bg-slate-900/60 transition-colors group"
                    >
                      <td className="p-2.5 border-r border-slate-800/80 text-slate-600 text-center font-sans text-[11px]">
                        {rowIndex + 1}
                      </td>
                      {row.map((cell, colIndex) => (
                        <td
                          key={colIndex}
                          className="p-2.5 border-r border-slate-800/60 group-hover:text-cyan-200"
                        >
                          {cell === null ? (
                            <span className="text-slate-600 italic">NULL</span>
                          ) : (
                            String(cell)
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
};
