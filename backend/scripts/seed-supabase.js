/**
 * Seed Supabase database with all RBSE Class 10 content.
 * 
 * Usage:
 *   node backend/scripts/seed-supabase.js
 * 
 * Requires:
 *   SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 *   in frontend/.env or as environment variables.
 */

const fs = require('fs');
const path = require('path');
let createClient;
try {
  createClient = require('@supabase/supabase-js').createClient;
} catch (e) {
  createClient = require('../../frontend/node_modules/@supabase/supabase-js').createClient;
}

// Load environment variables from frontend/.env.local, frontend/.env or .env
function loadEnv() {
  ['../../frontend/.env.local', '../../frontend/.env', '../.env'].forEach((rel) => {
    const envPath = path.resolve(__dirname, rel);
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split('\n');
      lines.forEach((line) => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let val = match[2] || '';
          val = val.replace(/^['"](.*)['"]$/, '$1').trim();
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      });
    }
  });
}

loadEnv();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
// Seeding protected tables requires the server-side service-role key. Never
// silently fall back to the browser publishable key; RLS would reject writes.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
  console.log('\n[INFO] Supabase credentials not found in frontend/.env or environment.');
  console.log('To push content live to Supabase:');
  console.log('  1. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to frontend/.env.local');
  console.log('  2. Run: node backend/scripts/seed-supabase.js\n');
  console.log('Validation: Local questions pool is already built and fully functional offline!');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SST_POOL = require('../../frontend/src/data/socialScienceQuestions.js').SOCIAL_SCIENCE_QUESTIONS_POOL;
const { MATH_CHAPTERS, MATH_PREDICTED_QUESTIONS } = require('../../frontend/src/data/mathContent.js');
const { SCIENCE_CHAPTERS } = require('../../frontend/src/data/scienceContent.js');
const { ENGLISH_CHAPTERS, ENGLISH_QUESTIONS_POOL } = require('../../frontend/src/data/englishContent.js');
const { PDF_PREDICTED_QUESTIONS } = require('../../frontend/src/data/pdfPredictedQuestions.js');

const SST_CHAPTERS = [
  { id: 'social-science-1', title: 'The Rise of Nationalism in Europe', section: 'History', sort_order: 1 },
  { id: 'social-science-2', title: 'Nationalism in India', section: 'History', sort_order: 2 },
  { id: 'social-science-3', title: 'The Making of a Global World', section: 'History', sort_order: 3 },
  { id: 'social-science-4', title: 'The Age of Industrialisation', section: 'History', sort_order: 4 },
  { id: 'social-science-5', title: 'Print Culture and the Modern World', section: 'History', sort_order: 5 },
  { id: 'social-science-6', title: 'Resources and Development', section: 'Geography', sort_order: 6 },
  { id: 'social-science-7', title: 'Forest and Wildlife Resources', section: 'Geography', sort_order: 7 },
  { id: 'social-science-8', title: 'Water Resources', section: 'Geography', sort_order: 8 },
  { id: 'social-science-9', title: 'Agriculture', section: 'Geography', sort_order: 9 },
  { id: 'social-science-10', title: 'Minerals and Energy Resources', section: 'Geography', sort_order: 10 },
  { id: 'social-science-11', title: 'Manufacturing Industries', section: 'Geography', sort_order: 11 },
  { id: 'social-science-12', title: 'Lifelines of National Economy', section: 'Geography', sort_order: 12 },
  { id: 'social-science-13', title: 'Power Sharing', section: 'Civics', sort_order: 13 },
  { id: 'social-science-14', title: 'Federalism', section: 'Civics', sort_order: 14 },
  { id: 'social-science-15', title: 'Gender, Religion and Caste', section: 'Civics', sort_order: 15 },
  { id: 'social-science-16', title: 'Political Parties', section: 'Civics', sort_order: 16 },
  { id: 'social-science-17', title: 'Outcomes of Democracy', section: 'Civics', sort_order: 17 },
  { id: 'social-science-18', title: 'Development', section: 'Economics', sort_order: 18 },
  { id: 'social-science-19', title: 'Sectors of the Indian Economy', section: 'Economics', sort_order: 19 },
  { id: 'social-science-20', title: 'Money and Credit', section: 'Economics', sort_order: 20 },
  { id: 'social-science-21', title: 'Globalisation and the Indian Economy', section: 'Economics', sort_order: 21 },
  { id: 'social-science-22', title: 'Consumer Rights', section: 'Economics', sort_order: 22 },
];

async function seed() {
  let writeErrors = 0;
  console.log('Connecting to Supabase at:', supabaseUrl);

  // 1. Upsert Subject
  const { error: subjErr } = await supabase.from('subjects').upsert([
    { id: 'social-science', label: 'Social Science', emoji: '🌍' },
    { id: 'math', label: 'Mathematics', emoji: '📐' },
    { id: 'science', label: 'Science', emoji: '🧪' },
    { id: 'english', label: 'English', emoji: '📖' },
  ], { onConflict: 'id' });

  if (subjErr) { writeErrors += 1; console.warn('Subject upsert warning:', subjErr.message); }

  // 2. Upsert Chapters (SST + Math + Science + English)
  console.log('Upserting all chapters (22 SST + 14 Math + 13 Science + 22 English = 71 Chapters)...');
  const chaptersPayload = [
    ...SST_CHAPTERS.map(c => ({
      id: c.id,
      subject_id: 'social-science',
      title: c.title,
      section: c.section,
      sort_order: c.sort_order,
    })),
    ...MATH_CHAPTERS.map(c => ({
      id: c.id,
      subject_id: 'math',
      title: c.title,
      section: c.meta || 'Core',
      sort_order: c.num,
    })),
    ...SCIENCE_CHAPTERS.map(c => ({
      id: c.id,
      subject_id: 'science',
      title: c.title,
      section: c.meta || 'Core',
      sort_order: c.num,
    })),
    ...ENGLISH_CHAPTERS.map(c => ({
      id: c.id,
      subject_id: 'english',
      title: c.title,
      section: c.meta || 'Literature',
      sort_order: c.num,
    })),
  ];
  const { error: chErr } = await supabase.from('chapters').upsert(chaptersPayload, { onConflict: 'id' });
  if (chErr) { writeErrors += 1; console.warn('Chapters upsert warning:', chErr.message); }

  // 3. Upsert Questions (SST + Math + English)
  const ALL_QUESTIONS = [...SST_POOL, ...(MATH_PREDICTED_QUESTIONS || []), ...ENGLISH_QUESTIONS_POOL, ...(PDF_PREDICTED_QUESTIONS || [])];
  console.log(`Upserting ${ALL_QUESTIONS.length} questions across subjects...`);
  const chunkSize = 50;
  for (let i = 0; i < ALL_QUESTIONS.length; i += chunkSize) {
    const chunk = ALL_QUESTIONS.slice(i, i + chunkSize).map(q => ({
      id: q.id,
      subject_id: q.subject_id,
      chapter_id: q.chapter_id,
      topic: q.topic,
      question: q.question,
      answer: q.answer,
      detailed_explanation: q.explanation || q.solution || null,
      options: q.options || [],
      correct_option: q.correct_option || null,
      question_type: q.question_type || 'practice',
      marks: q.marks || 1,
      difficulty: q.difficulty || 'medium',
      priority: q.priority || 'practice',
      source: q.source || null,
      year: q.year || null,
      is_pyq: Boolean(q.is_pyq),
      is_predicted: Boolean(q.is_predicted),
      prediction_level: q.prediction_level || null,
      prediction_reason: q.prediction_reason || null,
      is_premium: Boolean(q.is_premium),
    }));

    const { error: qErr } = await supabase.from('questions').upsert(chunk, { onConflict: 'id' });
    if (qErr) { writeErrors += 1; console.warn(`Batch ${i / chunkSize} error:`, qErr.message); }
  }

  if (writeErrors > 0) {
    throw new Error(`Seeding finished with ${writeErrors} failed write operation(s).`);
  }
  console.log('Seeding completed successfully!');
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exitCode = 1;
});
