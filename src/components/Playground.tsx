import React, { useState, useEffect } from 'react';
import { SqlEditor } from './SqlEditor';
import { ResultViewer } from './ResultViewer';
import { setupDatabase, executeQuery, getSqlEngine } from '../lib/sqlEngine';
import { Database, Plus, Trash2, Bookmark, Sparkles, RefreshCw, FolderPlus } from 'lucide-react';
import { DatabaseTableSchema, QueryResult, SavedSnippet } from '../types';
import { Database as SqlJsDatabase } from 'sql.js';

const SAMPLE_TEMPLATES = [
  {
    name: '🛒 ই-কমার্স শপ (E-Commerce)',
    tables: [
      {
        table: 'products',
        columns: ['id', 'title', 'price', 'stock'],
        data: [
          { id: 1, title: 'Gaming Laptop', price: 95000, stock: 5 },
          { id: 2, title: 'Wireless Mouse', price: 1200, stock: 45 },
          { id: 3, title: 'Mechanical Keyboard', price: 4500, stock: 18 },
          { id: 4, title: 'Curved Monitor', price: 28000, stock: 8 },
        ],
      },
      {
        table: 'orders',
        columns: ['id', 'product_id', 'customer_name', 'qty'],
        data: [
          { id: 101, product_id: 1, customer_name: 'Habib', qty: 1 },
          { id: 102, product_id: 2, customer_name: 'Tasnim', qty: 2 },
          { id: 103, product_id: 3, customer_name: 'Habib', qty: 1 },
        ],
      },
    ],
  },
  {
    name: '🎓 বিশ্ববিদ্যালয় স্টুডেন্ট সিস্টেম',
    tables: [
      {
        table: 'students',
        columns: ['id', 'name', 'cgpa', 'dept'],
        data: [
          { id: 1, name: 'Sabbir Rahman', cgpa: 3.85, dept: 'CSE' },
          { id: 2, name: 'Nusrat Jahan', cgpa: 3.92, dept: 'EEE' },
          { id: 3, name: 'Farhan Kabir', cgpa: 3.40, dept: 'CSE' },
          { id: 4, name: 'Mim Akter', cgpa: 3.75, dept: 'BBA' },
        ],
      },
    ],
  },
];

export const Playground: React.FC<{
  onAskAiForHelp: (query: string, errMsg?: string) => void;
}> = ({ onAskAiForHelp }) => {
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
  const [sql, setSql] = useState('SELECT * FROM products;');
  const [db, setDb] = useState<SqlJsDatabase | null>(null);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Saved snippets
  const [snippets, setSnippets] = useState<SavedSnippet[]>(() => {
    const saved = localStorage.getItem('sql_playground_snippets');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: '1',
            title: 'মোট বিক্রয় গণনা',
            query: 'SELECT SUM(price * stock) AS total_inventory_val FROM products;',
            createdAt: new Date().toLocaleDateString(),
          },
        ];
  });

  const [snippetTitle, setSnippetTitle] = useState('');

  // Initialize SQLite in-memory DB when template changes
  const initTemplate = async (index: number) => {
    setIsInitializing(true);
    try {
      const tmpl = SAMPLE_TEMPLATES[index];
      const mainTable = tmpl.tables[0];
      const addTables = tmpl.tables.slice(1);

      const newDb = await setupDatabase(mainTable, addTables);
      setDb(newDb);

      // Default query
      const defaultQuery = `SELECT * FROM ${mainTable.table};`;
      setSql(defaultQuery);

      // Run default query
      const res = executeQuery(newDb, defaultQuery);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    initTemplate(activeTemplateIndex);
  }, [activeTemplateIndex]);

  const handleRun = () => {
    if (!db) return;
    const res = executeQuery(db, sql);
    setResult(res);
  };

  const handleSaveSnippet = () => {
    if (!sql.trim()) return;
    const title = snippetTitle.trim() || `Snippet #${snippets.length + 1}`;
    const newSnippet: SavedSnippet = {
      id: Date.now().toString(),
      title,
      query: sql,
      createdAt: new Date().toLocaleDateString(),
    };
    const updated = [newSnippet, ...snippets];
    setSnippets(updated);
    localStorage.setItem('sql_playground_snippets', JSON.stringify(updated));
    setSnippetTitle('');
  };

  const handleDeleteSnippet = (id: string) => {
    const updated = snippets.filter((s) => s.id !== id);
    setSnippets(updated);
    localStorage.setItem('sql_playground_snippets', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Template Selector */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <span>স্বাধীন SQL প্লেগ্রাউন্ড (Sandbox)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              এখানে যেকোনো SQL কমান্ড (CREATE TABLE, INSERT, UPDATE, DELETE, JOIN) মুক্তভাবে লিখুন।
            </p>
          </div>

          {/* Template Chips */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-slate-400 font-semibold shrink-0">
              টেম্পলেট বেছে নিন:
            </span>
            {SAMPLE_TEMPLATES.map((tmpl, idx) => (
              <button
                key={tmpl.name}
                onClick={() => setActiveTemplateIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                  activeTemplateIndex === idx
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {tmpl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Saved Query Snippets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              সেভ করা স্নিপেট (Saved Snippets):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {snippets.map((snip) => (
              <div
                key={snip.id}
                className="group flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 px-3 py-1.5 rounded-xl text-xs transition-all"
              >
                <button
                  onClick={() => setSql(snip.query)}
                  className="text-cyan-300 font-mono hover:underline text-left"
                >
                  {snip.title}
                </button>
                <button
                  onClick={() => handleDeleteSnippet(snip.id)}
                  className="text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Add snippet form */}
            <div className="flex items-center gap-1.5 ml-auto">
              <input
                type="text"
                placeholder="স্নিপেটের নাম..."
                value={snippetTitle}
                onChange={(e) => setSnippetTitle(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1 outline-none focus:border-cyan-500 w-36"
              />
              <button
                onClick={handleSaveSnippet}
                disabled={!sql.trim()}
                className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
              >
                + সেভ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor & Result Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SqlEditor
          sql={sql}
          onChange={setSql}
          onRun={handleRun}
          onClear={() => setSql('')}
          isExecuting={isInitializing}
        />

        <ResultViewer
          result={result}
          onAskAiForHelp={(err) => onAskAiForHelp(sql, err)}
        />
      </div>
    </div>
  );
};
