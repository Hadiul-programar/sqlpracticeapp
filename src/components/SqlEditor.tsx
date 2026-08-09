import React, { useRef } from 'react';
import { Play, Trash2, Wand2, Sparkles, Terminal, Copy, Check } from 'lucide-react';

interface SqlEditorProps {
  sql: string;
  onChange: (sql: string) => void;
  onRun: () => void;
  onClear: () => void;
  isExecuting?: boolean;
}

const QUICK_KEYWORDS = [
  'SELECT',
  'FROM',
  'WHERE',
  'ORDER BY',
  'GROUP BY',
  'HAVING',
  'JOIN',
  'LIKE',
  'COUNT(*)',
  'AVG()',
];

export const SqlEditor: React.FC<SqlEditorProps> = ({
  sql,
  onChange,
  onRun,
  onClear,
  isExecuting = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = React.useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
    }
    // Handle tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const val = target.value;
      onChange(val.substring(0, start) + '  ' + val.substring(end));
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const insertKeyword = (keyword: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = sql;

    const prefix = current.substring(0, start);
    const suffix = current.substring(end);
    const needsSpace = prefix.length > 0 && !prefix.endsWith(' ') && !prefix.endsWith('\n');

    const inserted = (needsSpace ? ' ' : '') + keyword + ' ';
    const nextSql = prefix + inserted + suffix;

    onChange(nextSql);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + inserted.length;
    }, 0);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormat = () => {
    // Simple basic formatter: capitalize main keywords and clean up spaces
    let formatted = sql;
    QUICK_KEYWORDS.forEach((kw) => {
      const reg = new RegExp(`\\b${kw}\\b`, 'gi');
      formatted = formatted.replace(reg, kw);
    });
    onChange(formatted.trim());
  };

  const lineCount = Math.max(1, sql.split('\n').length);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-slate-200">SQL এডিটর</span>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            (শর্টকাট: Ctrl + Enter)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFormat}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 px-2.5 py-1 rounded-lg transition-colors border border-slate-700/60"
            title="কোড সাজান"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>ফরম্যাট</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 px-2.5 py-1 rounded-lg transition-colors border border-slate-700/60"
            title="কপি করুন"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'কপি হয়েছে' : 'কপি'}</span>
          </button>

          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1 rounded-lg transition-colors border border-rose-500/30"
            title="সব মুছে ফেলুন"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ক্লিয়ার</span>
          </button>
        </div>
      </div>

      {/* Quick SQL Keyword Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-500 shrink-0 font-medium text-[11px]">
          কীওয়ার্ড:
        </span>
        {QUICK_KEYWORDS.map((kw) => (
          <button
            key={kw}
            onClick={() => insertKeyword(kw)}
            className="bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/50 px-2 py-0.5 rounded font-mono text-[11px] shrink-0 transition-colors"
          >
            {kw}
          </button>
        ))}
      </div>

      {/* Editor Box with Line Numbers */}
      <div className="relative flex bg-slate-950 rounded-xl border border-slate-800 focus-within:border-cyan-500/80 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all overflow-hidden">
        {/* Line Numbers */}
        <div className="bg-slate-900/50 text-slate-600 font-mono text-xs px-3 py-3 select-none text-right border-r border-slate-800/80 shrink-0 leading-relaxed">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={sql}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="SELECT * FROM products WHERE price < 500;"
          className="w-full h-32 sm:h-40 bg-transparent text-slate-100 font-mono text-sm sm:text-base p-3 outline-none resize-y leading-relaxed tracking-wide placeholder:text-slate-600"
          spellCheck={false}
        />
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="text-xs text-slate-500 font-mono">
          {sql.length} অক্ষর • {lineCount} লাইন
        </span>

        <button
          onClick={onRun}
          disabled={isExecuting || !sql.trim()}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 text-sm"
        >
          {isExecuting ? (
            <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
          ) : (
            <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
          )}
          <span>{isExecuting ? 'রান হচ্ছে...' : '▶️ Run SQL'}</span>
        </button>
      </div>
    </div>
  );
};
