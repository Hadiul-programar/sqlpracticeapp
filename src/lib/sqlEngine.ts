import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { Question, QueryResult, DatabaseTableSchema } from '../types';

let sqlModulePromise: Promise<SqlJsStatic> | null = null;

export function getSqlEngine(): Promise<SqlJsStatic> {
  if (!sqlModulePromise) {
    sqlModulePromise = initSqlJs({
      locateFile: (file) => {
        if (file.endsWith('.wasm')) {
          return sqlWasmUrl || '/sql-wasm.wasm';
        }
        return `https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/${file}`;
      },
    });
  }
  return sqlModulePromise;
}

/**
 * Creates an in-memory SQLite database pre-loaded with the main table and additional tables for a question.
 */
export async function setupDatabase(
  mainTable: DatabaseTableSchema,
  additionalTables: DatabaseTableSchema[] = []
): Promise<Database> {
  const SQL = await getSqlEngine();
  const db = new SQL.Database();

  const allTables = [mainTable, ...additionalTables];

  for (const t of allTables) {
    if (!t.table || !t.columns || t.columns.length === 0) continue;

    // Drop table if exists
    db.run(`DROP TABLE IF EXISTS "${t.table}";`);

    // Infer column types or default to TEXT / REAL
    const colTypes = t.columns.map((col) => {
      // Find sample value to guess type
      const sample = t.data.find((r) => r[col] !== undefined && r[col] !== null)?.[col];
      if (typeof sample === 'number') {
        return Number.isInteger(sample) ? `"${col}" INTEGER` : `"${col}" REAL`;
      }
      return `"${col}" TEXT`;
    });

    const createSql = `CREATE TABLE "${t.table}" (${colTypes.join(', ')});`;
    db.run(createSql);

    // Insert rows
    for (const row of t.data) {
      const cols = t.columns.map((c) => `"${c}"`).join(', ');
      const placeholders = t.columns.map(() => '?').join(', ');
      const values = t.columns.map((c) => (row[c] !== undefined ? row[c] : null));

      db.run(`INSERT INTO "${t.table}" (${cols}) VALUES (${placeholders});`, values as any[]);
    }
  }

  return db;
}

/**
 * Executes a user SQL string against an active Database instance and tracks execution time.
 */
export function executeQuery(db: Database, query: string): QueryResult {
  const startTime = performance.now();
  const trimmed = query.trim();

  if (!trimmed) {
    return {
      columns: [],
      values: [],
      executionTimeMs: 0,
      rowCount: 0,
      error: 'অনুগ্রহ করে একটি SQL কোয়েরি লিখুন।',
    };
  }

  try {
    const res = db.exec(trimmed);
    const endTime = performance.now();
    const duration = parseFloat((endTime - startTime).toFixed(2));

    if (!res || res.length === 0) {
      return {
        columns: [],
        values: [],
        executionTimeMs: duration,
        rowCount: 0,
      };
    }

    const firstResult = res[0];
    return {
      columns: firstResult.columns,
      values: firstResult.values,
      executionTimeMs: duration,
      rowCount: firstResult.values.length,
    };
  } catch (err: any) {
    const endTime = performance.now();
    return {
      columns: [],
      values: [],
      executionTimeMs: parseFloat((endTime - startTime).toFixed(2)),
      rowCount: 0,
      error: err.message || 'SQL কোয়েরিতে ব্যাকরণগত ভুল (Syntax Error) রয়েছে।',
    };
  }
}

/**
 * Compares user execution result against answer execution result to check correctness.
 */
export async function checkAnswerCorrectness(
  db: Database,
  userResult: QueryResult,
  question: Question
): Promise<{ isCorrect: boolean; message: string }> {
  if (userResult.error) {
    return { isCorrect: false, message: `কোয়েরিতে ভুল আছে: ${userResult.error}` };
  }

  try {
    // For SELECT queries, compare expected output
    const expectedResArr = db.exec(question.answer);
    const expectedRes = expectedResArr && expectedResArr.length > 0
      ? {
          columns: expectedResArr[0].columns,
          values: expectedResArr[0].values,
        }
      : { columns: [], values: [] };

    // Stringify normalized versions for deep equality check
    const normalizedUserValues = JSON.stringify(userResult.values);
    const normalizedExpectedValues = JSON.stringify(expectedRes.values);

    if (normalizedUserValues === normalizedExpectedValues) {
      return { isCorrect: true, message: '🎉 অভিনন্দন! আপনার SQL কোয়েরির উত্তর সম্পূর্ণ সঠিক হয়েছে।' };
    }

    // Check if column counts match
    if (userResult.columns.length !== expectedRes.columns.length) {
      return {
        isCorrect: false,
        message: `❌ কলামের সংখ্যা মেলেনি। আপনার আউটপুটে ${userResult.columns.length} টি কলাম আছে, যেখানে প্রত্যাশিত ${expectedRes.columns.length} টি।`,
      };
    }

    // Check if row counts match
    if (userResult.rowCount !== expectedRes.values.length) {
      return {
        isCorrect: false,
        message: `❌ সারির (Row) সংখ্যা মেলেনি। আপনার আউটপুটে ${userResult.rowCount} টি সারি রয়েছে, কিন্তু প্রত্যাশিত ছিল ${expectedRes.values.length} টি।`,
      };
    }

    return {
      isCorrect: false,
      message: '❌ আউটপুট ডেটা মেলেনি। ফিল্টারিং বা সাজানোর শর্তটি আরেকবার পরীক্ষা করুন।',
    };
  } catch (err: any) {
    return { isCorrect: false, message: `উত্তর যাচাইকরণে ভুল: ${err.message}` };
  }
}
