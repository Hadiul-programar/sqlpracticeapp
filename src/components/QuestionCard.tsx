import React, { useState } from 'react';
import { Question, Level } from '../types';
import { Lightbulb, Eye, EyeOff, CheckCircle2, ChevronLeft, ChevronRight, HelpCircle, Layers, Table as TableIcon } from 'lucide-react';

interface QuestionCardProps {
  questions: Question[];
  currentQuestion: Question | null;
  onSelectQuestion: (questionId: number) => void;
  completedIds: number[];
  onSetSql: (sql: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  questions,
  currentQuestion,
  onSelectQuestion,
  completedIds,
  onSetSql,
}) => {
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  if (!currentQuestion) return null;

  const filteredQuestions = questions.filter(
    (q) => selectedLevel === 'all' || q.level === selectedLevel
  );

  const currentIndex = filteredQuestions.findIndex((q) => q.id === currentQuestion.id);
  const isCompleted = completedIds.includes(currentQuestion.id);

  const levelBadge = (level: Level) => {
    switch (level) {
      case 'easy':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">সহজ (Easy)</span>;
      case 'medium':
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">মাঝারি (Medium)</span>;
      case 'hard':
        return <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">কঠিন (Hard)</span>;
      case 'expert':
        return <span className="bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">এডভান্সড (Expert)</span>;
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectQuestion(filteredQuestions[currentIndex - 1].id);
      setShowHint(false);
      setShowAnswer(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      onSelectQuestion(filteredQuestions[currentIndex + 1].id);
      setShowHint(false);
      setShowAnswer(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Top Filter & Question Select Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <select
            value={currentQuestion.id}
            onChange={(e) => {
              onSelectQuestion(Number(e.target.value));
              setShowHint(false);
              setShowAnswer(false);
            }}
            className="w-full bg-slate-950 border border-slate-700/80 text-slate-200 text-sm rounded-xl px-3 py-2 outline-none focus:border-cyan-500 transition-colors cursor-pointer"
          >
            {filteredQuestions.map((q) => {
              const done = completedIds.includes(q.id);
              return (
                <option key={q.id} value={q.id}>
                  {done ? '✅ ' : '⏳ '} Q{q.id}: {q.title} ({q.category})
                </option>
              );
            })}
          </select>
        </div>

        {/* Level Filter Chips */}
        <div className="flex items-center gap-1.5 text-xs bg-slate-950 p-1 rounded-xl border border-slate-800">
          {['all', 'easy', 'medium', 'hard', 'expert'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors ${
                selectedLevel === lvl
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl === 'all' ? 'সব' : lvl}
            </button>
          ))}
        </div>

        {/* Prev / Next Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="পূর্ববর্তী প্রশ্ন"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-400 font-mono px-1">
            {currentIndex + 1} / {filteredQuestions.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIndex >= filteredQuestions.length - 1}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="পরবর্তী প্রশ্ন"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Question Display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-lg">
              প্রশ্ন #{currentQuestion.id}
            </span>
            {levelBadge(currentQuestion.level)}
            <span className="text-xs text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700/50">
              ক্যাটাগরি: {currentQuestion.category}
            </span>
          </div>

          {isCompleted && (
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>সম্পন্ন হয়েছে</span>
            </div>
          )}
        </div>

        <h2 className="text-lg font-bold text-slate-100 leading-snug">
          {currentQuestion.title}
        </h2>

        <div className="bg-slate-950/80 border-l-4 border-cyan-500 p-4 rounded-r-xl text-slate-200 text-sm leading-relaxed shadow-inner">
          {currentQuestion.question}
        </div>

        {/* Database Tables Involved */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
          <span className="flex items-center gap-1 font-semibold text-slate-300">
            <TableIcon className="w-3.5 h-3.5 text-cyan-400" />
            সংশ্লিষ্ট টেবিল:
          </span>
          <code className="bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20 font-mono font-bold">
            {currentQuestion.table}
          </code>
          <span className="text-slate-500">
            (কলাম: {currentQuestion.columns.join(', ')})
          </span>

          {currentQuestion.additionalTables?.map((t) => (
            <span key={t.table} className="flex items-center gap-1">
              <span className="text-slate-600">+</span>
              <code className="bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20 font-mono font-bold">
                {t.table}
              </code>
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons for Hints & Solution */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-1.5 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg transition-all font-medium"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>{showHint ? 'হিন্ট লুকান' : '💡 হিন্ট দেখুন'}</span>
        </button>

        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="flex items-center gap-1.5 text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg transition-all font-medium"
        >
          {showAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showAnswer ? 'উত্তর লুকান' : '👁️ উত্তর ও ব্যাখ্যা'}</span>
        </button>

        {showAnswer && (
          <button
            onClick={() => onSetSql(currentQuestion.answer)}
            className="flex items-center gap-1 text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 px-3 py-1.5 rounded-lg transition-all font-medium ml-auto"
          >
            <span>এডিটরে উত্তর বসান</span>
          </button>
        )}
      </div>

      {/* Hint Box */}
      {showHint && (
        <div className="bg-amber-950/30 border border-amber-500/30 p-3 rounded-xl text-amber-200 text-xs flex items-start gap-2 animate-fadeIn">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">সাহায্যকারী সংকেত (Hint):</span>
            <p className="leading-relaxed">{currentQuestion.hint}</p>
          </div>
        </div>
      )}

      {/* Answer & Explanation Box */}
      {showAnswer && (
        <div className="bg-indigo-950/40 border border-indigo-500/30 p-3.5 rounded-xl space-y-2 text-xs text-indigo-100 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-300">সঠিক SQL কোয়েরি:</span>
          </div>
          <pre className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-cyan-300 font-mono overflow-x-auto text-xs">
            {currentQuestion.answer}
          </pre>
          {currentQuestion.explanation && (
            <p className="text-slate-300 text-xs leading-relaxed border-t border-indigo-500/20 pt-2 mt-1">
              💡 <span className="font-medium text-indigo-200">ব্যাখ্যা:</span>{' '}
              {currentQuestion.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
