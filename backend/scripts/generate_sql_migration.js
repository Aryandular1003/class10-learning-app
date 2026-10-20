const fs = require('fs');
const path = require('path');

const { SST_CHAPTERS } = require('./seed-supabase-chapters.js');
const SST_POOL = require('../../frontend/src/data/socialScienceQuestions.js').SOCIAL_SCIENCE_QUESTIONS_POOL;
const { MATH_CHAPTERS, MATH_PREDICTED_QUESTIONS } = require('../../frontend/src/data/mathContent.js');
const { SCIENCE_CHAPTERS } = require('../../frontend/src/data/scienceContent.js');
const { ENGLISH_CHAPTERS, ENGLISH_QUESTIONS_POOL } = require('../../frontend/src/data/englishContent.js');
const { SOCIAL_SCIENCE_CONTENT } = require('../../frontend/src/data/socialScienceContent.js');
const { PDF_PREDICTED_QUESTIONS } = require('../../frontend/src/data/pdfPredictedQuestions.js');

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function escapeJson(obj) {
  if (obj === null || obj === undefined) return "'[]'::jsonb";
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

function parseMarkdownToSections(markdown, title, subject) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const sections = [];
  let current = null;

  const pushCurrent = () => {
    if (current && (current.content.trim() || current.heading)) {
      current.content = current.content.trim();
      sections.push(current);
    }
  };

  lines.forEach((line) => {
    const heading = line.match(/^#{2,4}\s+(.+)$/);
    if (heading) {
      pushCurrent();
      current = { heading: heading[1].replace(/[`*_]/g, ''), content: '' };
      return;
    }
    if (!current) return;
    current.content += `${line}\n`;
  });
  pushCurrent();

  return {
    title,
    subject,
    readTime: '12 mins',
    sections: sections.length ? sections : [{ heading: 'Full Chapter Revision Notes', content: markdown }]
  };
}

let sql = `-- ==============================================================================
-- 009_seed_all_rbse_class10_content.sql
-- Comprehensive RBSE Class 10 Content Seeding for Supabase PostgreSQL
-- Covers: Social Science (22 Chapters), Math (14 Chapters), Science (13 Chapters), English (22 Chapters)
-- Total Chapters: 71
-- Questions: MCQs, Short Answer, Long Answer, PYQs, and High-Probability Predictions
-- Safe to re-run (idempotent ON CONFLICT clauses).
-- ==============================================================================

-- 1. SEED ALL SUBJECTS
INSERT INTO public.subjects (id, label, emoji) VALUES
  ('social-science', 'Social Science', '🌍'),
  ('math', 'Mathematics', '📐'),
  ('science', 'Science', '🧪'),
  ('english', 'English', '📖')
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  emoji = EXCLUDED.emoji;

-- 2. SEED ALL 65 CHAPTERS
`;

const allChapters = [
  ...SST_CHAPTERS.map(c => ({ id: c.id, subject_id: 'social-science', title: c.title, section: c.section, sort_order: c.sort_order, file: SOCIAL_SCIENCE_CONTENT.find(s => s.chapterId === c.id)?.file, subDir: 'social-science' })),
  ...MATH_CHAPTERS.map(c => ({ id: c.id, subject_id: 'math', title: c.title, section: c.meta || 'Core', sort_order: c.num, file: c.file, subDir: 'math' })),
  ...SCIENCE_CHAPTERS.map(c => ({ id: c.id, subject_id: 'science', title: c.title, section: c.meta || 'Core', sort_order: c.num, file: c.file, subDir: 'science' })),
  ...ENGLISH_CHAPTERS.map(c => ({ id: c.id, subject_id: 'english', title: c.title, section: c.meta || 'Literature', sort_order: c.num, file: c.file, subDir: 'english' })),
];

allChapters.forEach(ch => {
  sql += `INSERT INTO public.chapters (id, subject_id, title, section, sort_order)
VALUES (${escapeSql(ch.id)}, ${escapeSql(ch.subject_id)}, ${escapeSql(ch.title)}, ${escapeSql(ch.section)}, ${ch.sort_order})
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  section = EXCLUDED.section,
  sort_order = EXCLUDED.sort_order;\n`;
});

sql += `\n-- 3. SEED CONTENT ITEMS (FULL NOTES FOR ALL 65 CHAPTERS)\n`;

const publicContentBase = path.resolve(__dirname, '../../frontend/public/content');

allChapters.forEach(ch => {
  if (!ch.file) return;
  const filePath = path.join(publicContentBase, ch.subDir, ch.file);
  if (!fs.existsSync(filePath)) return;

  const rawMd = fs.readFileSync(filePath, 'utf8');
  const parsed = parseMarkdownToSections(rawMd, ch.title, ch.subject_id);

  const itemId = `${ch.id}-notes`;
  sql += `INSERT INTO public.content_items (id, subject_id, chapter_id, chapter_name, content_type, content, status, source_refs)
VALUES (
  ${escapeSql(itemId)},
  ${escapeSql(ch.subject_id)},
  ${escapeSql(ch.id)},
  ${escapeSql(ch.title)},
  'notes',
  ${escapeJson(parsed)},
  'approved',
  '["RBSE Official Curriculum 2026-27"]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  content = EXCLUDED.content,
  status = 'approved';\n`;
});

sql += `\n-- 4. SEED QUESTIONS ACROSS ALL SUBJECTS\n`;

const allQuestions = [
  ...SST_POOL,
  ...(MATH_PREDICTED_QUESTIONS || []),
  ...ENGLISH_QUESTIONS_POOL,
  ...(PDF_PREDICTED_QUESTIONS || [])
];

allQuestions.forEach(q => {
  const explanation = q.detailed_explanation || q.explanation || q.solution || null;
  const isPyq = Boolean(q.is_pyq);
  const isPred = Boolean(q.is_predicted);
  const isPrem = Boolean(q.is_premium);
  const opts = q.options || [];

  sql += `INSERT INTO public.questions (
  id, subject_id, chapter_id, topic, question, answer, detailed_explanation,
  options, correct_option, question_type, marks, difficulty, priority,
  source, year, is_pyq, is_predicted, prediction_level, prediction_reason, is_premium
) VALUES (
  ${escapeSql(q.id)},
  ${escapeSql(q.subject_id)},
  ${escapeSql(q.chapter_id)},
  ${escapeSql(q.topic)},
  ${escapeSql(q.question)},
  ${escapeSql(q.answer)},
  ${escapeSql(explanation)},
  ${escapeJson(opts)},
  ${escapeSql(q.correct_option)},
  ${escapeSql(q.question_type || 'practice')},
  ${q.marks || 1},
  ${escapeSql(q.difficulty || 'medium')},
  ${escapeSql(q.priority || 'practice')},
  ${escapeSql(q.source)},
  ${q.year || 'NULL'},
  ${isPyq},
  ${isPred},
  ${escapeSql(q.prediction_level)},
  ${escapeSql(q.prediction_reason)},
  ${isPrem}
) ON CONFLICT (id) DO UPDATE SET
  question = EXCLUDED.question,
  answer = EXCLUDED.answer,
  detailed_explanation = EXCLUDED.detailed_explanation,
  options = EXCLUDED.options,
  correct_option = EXCLUDED.correct_option,
  marks = EXCLUDED.marks,
  difficulty = EXCLUDED.difficulty,
  priority = EXCLUDED.priority,
  is_pyq = EXCLUDED.is_pyq,
  is_predicted = EXCLUDED.is_predicted,
  is_premium = EXCLUDED.is_premium;\n`;
});

// Also seed chapter quizzes for English and other subjects where MCQs exist
sql += `\n-- 5. SEED QUIZZES AND QUIZ_QUESTIONS\n`;
const chaptersWithMCQs = {};
allQuestions.filter(q => q.question_type === 'mcq').forEach(q => {
  if (!chaptersWithMCQs[q.chapter_id]) chaptersWithMCQs[q.chapter_id] = [];
  chaptersWithMCQs[q.chapter_id].push(q.id);
});

Object.entries(chaptersWithMCQs).forEach(([chId, qIds]) => {
  const quizId = `quiz-${chId}`;
  const ch = allChapters.find(c => c.id === chId);
  const title = ch ? `${ch.title} Quick Quiz` : `Chapter Quiz`;
  const subjectId = ch ? ch.subject_id : 'english';

  sql += `INSERT INTO public.quizzes (id, chapter_id, subject_id, title, total_marks, duration_minutes, quiz_type, is_premium)
VALUES (${escapeSql(quizId)}, ${escapeSql(chId)}, ${escapeSql(subjectId)}, ${escapeSql(title)}, ${qIds.length}, 15, 'chapter_quiz', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, total_marks = EXCLUDED.total_marks;\n`;

  qIds.forEach((qId, idx) => {
    sql += `INSERT INTO public.quiz_questions (quiz_id, question_id, order_index)
VALUES (${escapeSql(quizId)}, ${escapeSql(qId)}, ${idx + 1})
ON CONFLICT (quiz_id, question_id) DO UPDATE SET order_index = EXCLUDED.order_index;\n`;
  });
});

const outPath = path.resolve(__dirname, '../supabase/migrations/009_seed_all_rbse_class10_content.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log(`Generated complete SQL migration file at: ${outPath} (size: ${(sql.length / 1024).toFixed(1)} KB)`);
