/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { QuestionCard } from './components/QuestionCard';
import { SqlEditor } from './components/SqlEditor';
import { ResultViewer } from './components/ResultViewer';
import { SchemaViewer } from './components/SchemaViewer';
import { Playground } from './components/Playground';
import { QuestionManager } from './components/QuestionManager';
import { ProgressStats } from './components/ProgressStats';
import { AiTutorModal } from './components/AiTutorModal';

import { Question, QueryResult, UserProgress } from './types';
import { DEFAULT_QUESTIONS } from './data/defaultQuestions';
import { setupDatabase, executeQuery, checkAnswerCorrectness } from './lib/sqlEngine';
import { Database } from 'sql.js';
import { Download } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'practice' | 'playground' | 'manager' | 'stats'>('practice');

  // Load stored questions or defaults
  const [questions, setQuestions] = useState<Question[]>(() => {
    const stored = localStorage.getItem('sql_practice_questions');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_QUESTIONS;
  });

  // Current Question ID
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(() => questions[0]?.id || 1);
  const currentQuestion = questions.find((q) => q.id === currentQuestionId) || questions[0] || null;

  // Active SQL Input
  const [sqlInput, setSqlInput] = useState<string>('');

  // Active Database instance for the current question
  const [db, setDb] = useState<Database | null>(null);
  const [isInitializingDb, setIsInitializingDb] = useState<boolean>(true);

  // Execution Result & Correctness
  const [result, setResult] = useState<QueryResult | null>(null);
  const [correctness, setCorrectness] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // AI Tutor Modal
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalQuery, setAiModalQuery] = useState('');
  const [aiModalError, setAiModalError] = useState('');

  // User Progress
  const [progress, setProgress] = useState<UserProgress>(() => {
    const stored = localStorage.getItem('sql_practice_progress');
    const todayStr = new Date().toISOString().split('T')[0];
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return {
      completedQuestionIds: [],
      streakDays: 1,
      lastActiveDate: todayStr,
      points: 0,
      attemptsCount: 0,
      correctCount: 0,
    };
  });

  // Save Progress
  const saveProgress = (newProg: UserProgress) => {
    setProgress(newProg);
    localStorage.setItem('sql_practice_progress', JSON.stringify(newProg));
  };

  // Re-build SQLite database whenever current question changes
  useEffect(() => {
    let isCancelled = false;

    async function loadQuestionDb() {
      if (!currentQuestion) return;
      setIsInitializingDb(true);
      setResult(null);
      setCorrectness(null);

      try {
        const mainTable = {
          table: currentQuestion.table,
          columns: currentQuestion.columns,
          data: currentQuestion.data,
        };
        const newDb = await setupDatabase(mainTable, currentQuestion.additionalTables || []);

        if (!isCancelled) {
          setDb(newDb);
        }
      } catch (e) {
        console.error('Failed to setup DB for question:', e);
      } finally {
        if (!isCancelled) {
          setIsInitializingDb(false);
        }
      }
    }

    loadQuestionDb();

    return () => {
      isCancelled = true;
    };
  }, [currentQuestionId, currentQuestion]);

  // Handle SQL Execution
  const handleRunSql = async () => {
    if (!db || !currentQuestion) return;
    setIsExecuting(true);

    try {
      const res = executeQuery(db, sqlInput);
      setResult(res);

      // Check correctness
      const checkRes = await checkAnswerCorrectness(db, res, currentQuestion);
      setCorrectness(checkRes);

      // Update progress
      const todayStr = new Date().toISOString().split('T')[0];
      const isNewCompletion = checkRes.isCorrect && !progress.completedQuestionIds.includes(currentQuestion.id);

      const nextCompleted = isNewCompletion
        ? [...progress.completedQuestionIds, currentQuestion.id]
        : progress.completedQuestionIds;

      const pointsEarned = isNewCompletion ? (currentQuestion.level === 'easy' ? 10 : currentQuestion.level === 'medium' ? 20 : 30) : 0;

      // Update streak
      let nextStreak = progress.streakDays;
      if (progress.lastActiveDate !== todayStr) {
        const lastDate = new Date(progress.lastActiveDate);
        const todayDate = new Date(todayStr);
        const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

        if (diffDays === 1) {
          nextStreak += 1;
        } else if (diffDays > 1) {
          nextStreak = 1;
        }
      }

      saveProgress({
        ...progress,
        completedQuestionIds: nextCompleted,
        points: progress.points + pointsEarned,
        attemptsCount: progress.attemptsCount + 1,
        correctCount: progress.correctCount + (checkRes.isCorrect ? 1 : 0),
        streakDays: nextStreak,
        lastActiveDate: todayStr,
      });
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  // Questions Save
  const handleSaveQuestions = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    localStorage.setItem('sql_practice_questions', JSON.stringify(newQuestions));
    if (newQuestions.length > 0) {
      setCurrentQuestionId(newQuestions[0].id);
    }
  };

  const handleResetQuestionsToDefault = () => {
    if (confirm('আপনি কি সকল প্রশ্ন রিসেট করে ডিফল্ট সেটিংসে ফিরিয়ে নিতে চান?')) {
      setQuestions(DEFAULT_QUESTIONS);
      localStorage.removeItem('sql_practice_questions');
      setCurrentQuestionId(DEFAULT_QUESTIONS[0].id);
    }
  };

  const handleOpenAiHelp = (query: string, error?: string) => {
    setAiModalQuery(query || sqlInput);
    setAiModalError(error || '');
    setAiModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        progress={progress}
        onOpenAiTutor={() => handleOpenAiHelp(sqlInput)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* TAB 1: PRACTICE QUESTIONS */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            {/* Question Card */}
            <QuestionCard
              questions={questions}
              currentQuestion={currentQuestion}
              onSelectQuestion={setCurrentQuestionId}
              completedIds={progress.completedQuestionIds}
              onSetSql={setSqlInput}
            />

            {/* Editor & Result Viewers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="space-y-6">
                <SqlEditor
                  sql={sqlInput}
                  onChange={setSqlInput}
                  onRun={handleRunSql}
                  onClear={() => {
                    setSqlInput('');
                    setResult(null);
                    setCorrectness(null);
                  }}
                  isExecuting={isExecuting || isInitializingDb}
                />

                {/* Database Schema Preview */}
                <SchemaViewer currentQuestion={currentQuestion} />
              </div>

              <div className="space-y-6">
                <ResultViewer
                  result={result}
                  correctnessMessage={correctness}
                  onAskAiForHelp={(err) => handleOpenAiHelp(sqlInput, err)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PLAYGROUND */}
        {activeTab === 'playground' && (
          <Playground onAskAiForHelp={handleOpenAiHelp} />
        )}

        {/* TAB 3: QUESTION MANAGER */}
        {activeTab === 'manager' && (
          <QuestionManager
            questions={questions}
            onSaveQuestions={handleSaveQuestions}
            onResetToDefault={handleResetQuestionsToDefault}
          />
        )}

        {/* TAB 4: STATS & PROGRESS */}
        {activeTab === 'stats' && (
          <ProgressStats progress={progress} questions={questions} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            🗄️ SQL Practice App • বাংলা এসকিউএল লার্নিং প্ল্যাটফর্ম • ইন-মেমোরি SQLite ইঞ্জিন চালিত
          </p>
          <a
            href="/api/download-zip"
            download="sql-practice-studio-source.zip"
            className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-medium bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>পুরো প্রজেক্টের Source Code (ZIP) ডাউনলোড</span>
          </a>
        </div>
      </footer>

      {/* AI Tutor Modal */}
      <AiTutorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        initialQuery={aiModalQuery}
        initialError={aiModalError}
        questionTitle={currentQuestion?.title}
      />
    </div>
  );
}
