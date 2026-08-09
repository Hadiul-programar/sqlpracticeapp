import React from 'react';
import { Database, Terminal, Settings, Award, Sparkles, Flame, Download } from 'lucide-react';
import { UserProgress } from '../types';

interface HeaderProps {
  activeTab: 'practice' | 'playground' | 'manager' | 'stats';
  setActiveTab: (tab: 'practice' | 'playground' | 'manager' | 'stats') => void;
  progress: UserProgress;
  onOpenAiTutor: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  progress,
  onOpenAiTutor,
}) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              SQL Practice App
            </h1>
            <p className="text-xs text-slate-400">
              নিজে শিখুন • SQL লিখুন • রিয়েল ইঞ্জিনে এক্সিকিউট করুন
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-950/60 p-1 rounded-xl border border-slate-800/80 text-sm overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'practice'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>অনুশীলনী</span>
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'playground'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>প্লেগ্রাউন্ড</span>
          </button>

          <button
            onClick={() => setActiveTab('manager')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'manager'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>প্রশ্ন ম্যানেজার</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'stats'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>পরিসংখ্যান</span>
          </button>
        </nav>

        {/* Streaks & AI Tutor & Download Button */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg text-amber-400 text-xs font-semibold">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{progress.streakDays} দিন স্ট্রিক</span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-emerald-400 text-xs font-semibold">
            <span>{progress.points} পয়েন্ট</span>
          </div>

          <button
            onClick={onOpenAiTutor}
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all transform active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span>বাংলা AI টিউটর</span>
          </button>

          <a
            href="/api/download-zip"
            download="sql-practice-studio-source.zip"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
            title="পুরো প্রজেক্ট কোড ZIP ডাউনলোড করুন"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>কোড ডাউনলোড (ZIP)</span>
          </a>
        </div>
      </div>
    </header>
  );
};
