import React, { useState } from 'react';
import { Question, Level } from '../types';
import { Plus, Trash2, Edit2, Download, Upload, RotateCcw, Save, X, Code, Check } from 'lucide-react';

interface QuestionManagerProps {
  questions: Question[];
  onSaveQuestions: (newQuestions: Question[]) => void;
  onResetToDefault: () => void;
}

export const QuestionManager: React.FC<QuestionManagerProps> = ({
  questions,
  onSaveQuestions,
  onResetToDefault,
}) => {
  const [mode, setMode] = useState<'list' | 'edit' | 'raw_json'>('list');
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);
  const [rawJsonText, setRawJsonText] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Open editor for adding/editing a question
  const handleOpenEdit = (q?: Question) => {
    if (q) {
      setEditingQuestion(JSON.parse(JSON.stringify(q)));
    } else {
      const nextId = questions.length > 0 ? Math.max(...questions.map((item) => item.id)) + 1 : 1;
      setEditingQuestion({
        id: nextId,
        title: 'নতুন অনুশীলন প্রশ্ন',
        question: 'প্রশ্ন এখানে লিখুন...',
        category: 'Custom',
        table: 'items',
        columns: ['id', 'name', 'price'],
        data: [
          { id: 1, name: 'Item A', price: 100 },
          { id: 2, name: 'Item B', price: 250 },
        ],
        answer: 'SELECT * FROM items;',
        hint: 'একটি সাধারণ SELECT কোয়েরি লিখুন।',
        level: 'easy',
        explanation: 'সহজ প্রশ্ন ব্যাখ্যা।',
      });
    }
    setMode('edit');
  };

  const handleSaveForm = () => {
    if (!editingQuestion || !editingQuestion.title || !editingQuestion.answer) {
      alert('দয়া করে শিরোনাম এবং উত্তর SQL পূরণ করুন!');
      return;
    }

    const updated = [...questions];
    const existingIdx = updated.findIndex((q) => q.id === editingQuestion.id);

    if (existingIdx >= 0) {
      updated[existingIdx] = editingQuestion as Question;
    } else {
      updated.push(editingQuestion as Question);
    }

    onSaveQuestions(updated);
    setMode('list');
  };

  const handleDelete = (id: number) => {
    if (confirm(`আপনি কি প্রশ্ন #${id} মুছে ফেলতে চান?`)) {
      const updated = questions.filter((q) => q.id !== id);
      onSaveQuestions(updated);
    }
  };

  const handleOpenRawJson = () => {
    setRawJsonText(JSON.stringify(questions, null, 2));
    setJsonError(null);
    setMode('raw_json');
  };

  const handleSaveRawJson = () => {
    try {
      const parsed = JSON.parse(rawJsonText);
      if (!Array.isArray(parsed)) throw new Error('JSON অবজেক্টটি একটি Array হতে হবে');
      onSaveQuestions(parsed);
      setMode('list');
    } catch (e: any) {
      setJsonError('বৈধ JSON নয়: ' + e.message);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'sql_questions_backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">🛠️ কাস্টম প্রশ্ন ও ডেটা এডিটর</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            নিজের ইচ্ছামতো নতুন প্রশ্ন যোগ করুন, সংশোধন করুন বা JSON ফরম্যাটে ইমপোর্ট/এক্সপোর্ট করুন।
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {mode === 'list' && (
            <>
              <button
                onClick={() => handleOpenEdit()}
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন প্রশ্ন যোগ করুন</span>
              </button>

              <button
                onClick={handleOpenRawJson}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold transition-all border border-slate-700"
              >
                <Code className="w-4 h-4 text-cyan-400" />
                <span>Raw JSON এডিটর</span>
              </button>

              <button
                onClick={handleExportJson}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold transition-all border border-slate-700"
              >
                <Download className="w-4 h-4 text-purple-400" />
                <span>ডাউনলোড JSON</span>
              </button>

              <button
                onClick={onResetToDefault}
                className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              >
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>ডিফল্টে রিসেট</span>
              </button>
            </>
          )}

          {mode !== 'list' && (
            <button
              onClick={() => setMode('list')}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            >
              <X className="w-4 h-4" />
              <span>বাতিল (Cancel)</span>
            </button>
          )}
        </div>
      </div>

      {/* Mode 1: List View */}
      {mode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-4 space-y-3 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    Q#{q.id} • {q.level}
                  </span>
                  <h3 className="text-sm font-bold text-slate-200 mt-1.5">{q.title}</h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(q)}
                    className="p-1.5 text-slate-400 hover:text-cyan-300 bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                    title="এডিট করুন"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                    title="মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2">{q.question}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono border-t border-slate-800/80 pt-2">
                <span>টেবিল: {q.table}</span>
                <span>ক্যাটাগরি: {q.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mode 2: Form Editor */}
      {mode === 'edit' && editingQuestion && (
        <div className="space-y-4 max-w-3xl mx-auto bg-slate-950 p-6 rounded-xl border border-slate-800">
          <h3 className="text-base font-bold text-cyan-400">
            {editingQuestion.id ? `প্রশ্ন #${editingQuestion.id} এডিট করুন` : 'নতুন প্রশ্ন তৈরি করুন'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">শিরোনাম (Title):</label>
              <input
                type="text"
                value={editingQuestion.title || ''}
                onChange={(e) => setEditingQuestion({ ...editingQuestion, title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2.5 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">ক্যাটাগরি:</label>
              <input
                type="text"
                value={editingQuestion.category || ''}
                onChange={(e) => setEditingQuestion({ ...editingQuestion, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2.5 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">ডিফিকাল্টি লেভেল:</label>
              <select
                value={editingQuestion.level || 'easy'}
                onChange={(e) =>
                  setEditingQuestion({ ...editingQuestion, level: e.target.value as Level })
                }
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2.5 outline-none focus:border-cyan-500"
              >
                <option value="easy">Easy (সহজ)</option>
                <option value="medium">Medium (মাঝারি)</option>
                <option value="hard">Hard (কঠিন)</option>
                <option value="expert">Expert (এডভান্সড)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">মূল টেবিল নাম (Table):</label>
              <input
                type="text"
                value={editingQuestion.table || ''}
                onChange={(e) => setEditingQuestion({ ...editingQuestion, table: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2.5 outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-1">প্রশ্ন বিবরণ (Question Prompt):</label>
            <textarea
              rows={3}
              value={editingQuestion.question || ''}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-1">সঠিক SQL উত্তর (Answer SQL):</label>
            <input
              type="text"
              value={editingQuestion.answer || ''}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, answer: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs rounded-lg p-2.5 outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">সাহায্যকারী ইঙ্গিত (Hint):</label>
              <input
                type="text"
                value={editingQuestion.hint || ''}
                onChange={(e) => setEditingQuestion({ ...editingQuestion, hint: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2.5 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">ব্যাখ্যা (Explanation):</label>
              <input
                type="text"
                value={editingQuestion.explanation || ''}
                onChange={(e) =>
                  setEditingQuestion({ ...editingQuestion, explanation: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2.5 outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              onClick={() => setMode('list')}
              className="px-4 py-2 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
            >
              বাতিল
            </button>
            <button
              onClick={handleSaveForm}
              className="px-5 py-2 rounded-xl text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow"
            >
              সেভ করুন
            </button>
          </div>
        </div>
      )}

      {/* Mode 3: Raw JSON Editor */}
      {mode === 'raw_json' && (
        <div className="space-y-3">
          {jsonError && (
            <div className="p-3 bg-rose-950/80 border border-rose-500 text-rose-200 text-xs rounded-xl">
              {jsonError}
            </div>
          )}

          <textarea
            rows={16}
            value={rawJsonText}
            onChange={(e) => setRawJsonText(e.target.value)}
            className="w-full bg-slate-950 text-emerald-400 font-mono text-xs p-4 rounded-xl border border-slate-800 outline-none focus:border-cyan-500 leading-relaxed"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setMode('list')}
              className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-300"
            >
              বাতিল
            </button>
            <button
              onClick={handleSaveRawJson}
              className="px-5 py-2 rounded-xl text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow"
            >
              💾 সেভ চেঞ্জেস
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
