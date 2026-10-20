const fs = require('fs');
const path = require('path');

const englishDir = path.resolve(__dirname, '../../frontend/public/content/english');

const ENGLISH_CHAPTERS = [
  { id: 'english-1', num: 1, title: 'A Letter to God', file: 'english-01-a-letter-to-god.md', meta: 'First Flight Prose' },
  { id: 'english-2', num: 2, title: 'Nelson Mandela: Long Walk to Freedom', file: 'english-02-nelson-mandela-long-walk-to-freedom.md', meta: 'First Flight Prose' },
  { id: 'english-3', num: 3, title: 'Two Stories about Flying', file: 'english-03-two-stories-about-flying.md', meta: 'First Flight Prose' },
  { id: 'english-4', num: 4, title: 'From the Diary of Anne Frank', file: 'english-04-from-the-diary-of-anne-frank.md', meta: 'First Flight Prose' },
  { id: 'english-5', num: 5, title: 'Glimpses of India', file: 'english-05-glimpses-of-india.md', meta: 'First Flight Prose' },
  { id: 'english-6', num: 6, title: 'Mijbil the Otter', file: 'english-06-mijbil-the-otter.md', meta: 'First Flight Prose' },
  { id: 'english-7', num: 7, title: 'Madam Rides the Bus', file: 'english-07-madam-rides-the-bus.md', meta: 'First Flight Prose' },
  { id: 'english-8', num: 8, title: 'The Sermon at Benares', file: 'english-08-the-sermon-at-benares.md', meta: 'First Flight Prose' },
  { id: 'english-9', num: 9, title: 'The Proposal', file: 'english-09-the-proposal.md', meta: 'First Flight Drama' },
  { id: 'english-10', num: 10, title: 'Dust of Snow & Fire and Ice', file: 'english-10-dust-of-snow-and-fire-and-ice.md', meta: 'Poetry' },
  { id: 'english-11', num: 11, title: 'A Tiger in the Zoo & Amanda!', file: 'english-11-a-tiger-in-the-zoo-and-amanda.md', meta: 'Poetry' },
  { id: 'english-12', num: 12, title: 'A Triumph of Surgery', file: 'english-12-a-triumph-of-surgery.md', meta: 'Supplementary Reader' },
  { id: 'english-13', num: 13, title: "The Thief's Story", file: 'english-13-the-thiefs-story.md', meta: 'Supplementary Reader' },
  { id: 'english-14', num: 14, title: 'Footprints Without Feet', file: 'english-14-footprints-without-feet.md', meta: 'Supplementary Reader' },
  { id: 'english-15', num: 15, title: 'Bholi', file: 'english-15-bholi.md', meta: 'Supplementary Reader' },
  { id: 'english-16', num: 16, title: 'Grammar & Writing Skills', file: 'english-16-grammar-and-writing-skills.md', meta: 'Language & Writing' },
];

const allQuestions = [];

ENGLISH_CHAPTERS.forEach((ch) => {
  const filePath = path.join(englishDir, ch.file);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');

  // Extract MCQ section
  const mcqSectionMatch = content.match(/(?:15-Question MCQ Quiz|MCQ Quiz|8\.\s*15-Question MCQ Quiz)[\s\S]*?(?:9\.\s*Syllabus|$)/i);
  if (mcqSectionMatch) {
    const mcqText = mcqSectionMatch[0];
    // Split by questions: 1. or Where / What / etc.
    const qMatches = [...mcqText.matchAll(/(?:^|\n)(?:(\d+)\.\s*)?([^\n\r?]+\?)\s*\n\s*\(A\)\s*([^\n]+)\s*\n\s*\(B\)\s*([^\n]+)\s*\n\s*\(C\)\s*([^\n]+)\s*\n\s*\(D\)\s*([^\n]+)\s*\n\s*Answer:\s*\(([A-D])\)(?:[^\n|]*\|\s*Explanation:\s*([^\n\r]+))?/gi)];

    qMatches.forEach((m, idx) => {
      const qNum = m[1] || (idx + 1);
      const qText = m[2].trim();
      const optA = m[3].trim();
      const optB = m[4].trim();
      const optC = m[5].trim();
      const optD = m[6].trim();
      const correctOpt = m[7].trim().toUpperCase();
      const explanation = m[8] ? m[8].trim() : `Correct answer: (${correctOpt})`;

      allQuestions.push({
        id: `${ch.id}-mcq-${qNum}`,
        subject_id: 'english',
        chapter_id: ch.id,
        chapter_name: ch.title,
        topic: ch.meta,
        question: qText,
        answer: correctOpt === 'A' ? optA : correctOpt === 'B' ? optB : correctOpt === 'C' ? optC : optD,
        detailed_explanation: explanation,
        options: [`A) ${optA}`, `B) ${optB}`, `C) ${optC}`, `D) ${optD}`],
        correct_option: correctOpt,
        question_type: 'mcq',
        marks: 1,
        difficulty: idx < 5 ? 'easy' : idx < 10 ? 'medium' : 'hard',
        priority: idx < 6 ? 'must_do' : 'important',
        year: 2026,
        source: `RBSE Class 10 BoardReady Quiz (${ch.title})`,
        is_pyq: false,
        is_predicted: idx >= 10,
        prediction_level: idx >= 10 ? 'High' : null,
        prediction_reason: idx >= 10 ? 'Frequently tested comprehension concept in RBSE secondary exams' : null,
        is_premium: idx >= 12
      });
    });
  }

  // Extract Short / Long practice questions
  const practiceSection = content.match(/(?:7\.\s*Generated Practice Questions|Generated Practice Questions)[\s\S]*?(?:8\.\s*15-Question|15-Question|$)/i);
  if (practiceSection) {
    const text = practiceSection[0];
    const saqMatches = [...text.matchAll(/(?:Question:\s*|\d+\.\s*)([^\n\r?]+\?)\s*\n\s*Model Answer:\s*([^\n\r]+(?:\n[^\n\r#]+)*)/gi)];
    saqMatches.forEach((m, idx) => {
      const qText = m[1].trim();
      const aText = m[2].trim();
      allQuestions.push({
        id: `${ch.id}-saq-${idx + 1}`,
        subject_id: 'english',
        chapter_id: ch.id,
        chapter_name: ch.title,
        topic: ch.meta,
        question: qText,
        answer: aText,
        detailed_explanation: aText,
        options: [],
        correct_option: null,
        question_type: aText.length > 200 ? 'long' : 'short',
        marks: aText.length > 200 ? 5 : 2,
        difficulty: aText.length > 200 ? 'hard' : 'medium',
        priority: 'must_do',
        year: 2026,
        source: `RBSE Model Board Practice (${ch.title})`,
        is_pyq: false,
        is_predicted: true,
        prediction_level: 'Very High',
        prediction_reason: 'Core textbook analytical question emphasized in RBSE official blueprint',
        is_premium: false
      });
    });
  }

  // Extract PYQ questions
  const pyqSection = content.match(/(?:6\.\s*Verified Previous-Year|Verified Previous-Year)[\s\S]*?(?:7\.\s*Generated Practice|Generated Practice|$)/i);
  if (pyqSection) {
    const text = pyqSection[0];
    const pyqMatches = [...text.matchAll(/(?:Question:\s*|\d+\.\s*)([^\n\r?]+\?(?:\s*\[[^\]]+\])?)\s*\n\s*Model Answer:\s*([^\n\r]+(?:\n[^\n\r#]+)*)/gi)];
    pyqMatches.forEach((m, idx) => {
      const qText = m[1].trim();
      const aText = m[2].trim();
      const year = text.includes('2024') ? 2024 : 2025;
      allQuestions.push({
        id: `${ch.id}-pyq-${idx + 1}`,
        subject_id: 'english',
        chapter_id: ch.id,
        chapter_name: ch.title,
        topic: ch.meta,
        question: qText,
        answer: aText,
        detailed_explanation: aText,
        options: [],
        correct_option: null,
        question_type: 'short',
        marks: 2,
        difficulty: 'medium',
        priority: 'must_do',
        year: year,
        source: `RBSE Secondary Board Paper ${year} (S-02-English)`,
        is_pyq: true,
        is_predicted: false,
        is_premium: false
      });
    });
  }
});

console.log(`Extracted total ${allQuestions.length} English questions!`);

const outputCode = `// Autogenerated English content manifest and question pool for RBSE Class 10
export const ENGLISH_CHAPTERS = ${JSON.stringify(ENGLISH_CHAPTERS, null, 2)};

export const ENGLISH_QUESTIONS_POOL = ${JSON.stringify(allQuestions, null, 2)};
`;

fs.writeFileSync(path.resolve(__dirname, '../../frontend/src/data/englishContent.js'), outputCode, 'utf8');
console.log('Saved frontend/src/data/englishContent.js successfully!');
