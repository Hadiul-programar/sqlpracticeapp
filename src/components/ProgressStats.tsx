import React from 'react';
import { UserProgress, Question } from '../types';
import { Award, CheckCircle2, Flame, Target, Trophy, Sparkles } from 'lucide-react';

interface ProgressStatsProps {
  progress: UserProgress;
  questions: Question[];
}

export const ProgressStats: React.FC<ProgressStatsProps> = ({ progress, questions }) => {
  const totalQuestions = questions.length;
  const completedCount = progress.completedQuestionIds.length;
  const percentage = Math.round((completedCount / (totalQuestions || 1)) * 100);

  const accuracy =
    progress.attemptsCount > 0
      ? Math.round((progress.correctCount / progress.attemptsCount) * 100)
      : 100;

  // Badges calculations
  const badges = [
    {
      id: 'novice',
      title: 'SQL শুরূকারী (Novice)',
      description: 'কমপক্ষে ১টি অনুশীলনী সফলভাবে সমাধান করা।',
      unlocked: completedCount >= 1,
      icon: '🌱',
    },
    {
      id: 'intermediate',
      title: 'এসকিউএল এক্সপ্লোরার (Explorer)',
      description: 'কমপক্ষে ৫টি অনুশীলনী সমাধান করা।',
      unlocked: completedCount >= 5,
      icon: '🔍',
    },
    {
      id: 'streak_3',
      title: 'ধারাবাহিক লার্নার (Streak Master)',
      description: '৩ দিন বা তার বেশি স্ট্রিক বজায় রাখা।',
      unlocked: progress.streakDays >= 3,
      icon: '🔥',
    },
    {
      id: 'master',
      title: 'SQL ডাটাবেন উইজার্ড (Master)',
      description: 'সকল অনুশীলনী সফলভাবে সম্পন্ন করা।',
      unlocked: completedCount >= totalQuestions && totalQuestions > 0,
      icon: '👑',
    },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Top Title */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>আপনার অগ্রগতি ও অর্জন (Progress & Achievements)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          আপনার অনুশীলনের পরিসংখ্যান, অর্জিত পয়েন্ট এবং ব্যাজসমূহ দেখুন।
        </p>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Completed Percentage */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>সম্পন্ন হয়েছে</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            {completedCount} / {totalQuestions}
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 font-mono block">
            সমাপ্তির হার: {percentage}%
          </span>
        </div>

        {/* Card 2: Streak */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>ডেইলি স্ট্রিক</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">
            {progress.streakDays} দিন
          </div>
          <p className="text-[11px] text-slate-500">
            প্রতিদিন অনুশীলন করে স্ট্রিক সচল রাখুন!
          </p>
        </div>

        {/* Card 3: Total Points */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>অর্জিত পয়েন্ট</span>
            <Trophy className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-400">
            {progress.points} PTS
          </div>
          <p className="text-[11px] text-slate-500">
            প্রতিটি সঠিক উত্তরের জন্য পয়েন্ট যোগ হয়।
          </p>
        </div>

        {/* Card 4: Accuracy Rate */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>সঠিকতার হার (Accuracy)</span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-purple-400">
            {accuracy}%
          </div>
          <p className="text-[11px] text-slate-500">
            মোট চেষ্টা: {progress.attemptsCount} | সঠিক: {progress.correctCount}
          </p>
        </div>
      </div>

      {/* Badges Section */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>অর্জিত ব্যাজসমূহ (Badges):</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-xl border transition-all ${
                b.unlocked
                  ? 'bg-slate-950 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-50 grayscale'
              }`}
            >
              <div className="text-3xl mb-2">{b.icon}</div>
              <h4 className="text-xs font-bold text-slate-200">{b.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {b.description}
              </p>
              <div className="mt-3">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    b.unlocked
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                >
                  {b.unlocked ? 'Unlocked 🎉' : 'Locked 🔒'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
