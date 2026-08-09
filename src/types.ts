export type Level = 'easy' | 'medium' | 'hard' | 'expert';

export interface DatabaseRow {
  [columnName: string]: string | number | boolean | null;
}

export interface DatabaseTableSchema {
  table: string;
  columns: string[];
  data: DatabaseRow[];
}

export interface Question {
  id: number;
  title: string;
  question: string;
  category: string;
  table: string;
  columns: string[];
  data: DatabaseRow[];
  additionalTables?: DatabaseTableSchema[];
  answer: string;
  hint: string;
  level: Level;
  explanation?: string;
}

export interface QueryResult {
  columns: string[];
  values: any[][];
  executionTimeMs: number;
  rowCount: number;
  error?: string;
}

export interface UserProgress {
  completedQuestionIds: number[];
  streakDays: number;
  lastActiveDate: string;
  points: number;
  attemptsCount: number;
  correctCount: number;
}

export interface SavedSnippet {
  id: string;
  title: string;
  query: string;
  createdAt: string;
}

export interface HistoryItem {
  id: string;
  query: string;
  timestamp: string;
  isSuccess: boolean;
  questionId?: number;
}
