const fs = require('fs');
const path = require('path');

const SST_DIR = path.resolve(__dirname, '../../frontend/public/content/social-science');
const OUTPUT_FILE = path.resolve(__dirname, '../../frontend/src/data/socialScienceQuestions.js');

const CHAPTERS = [
  { id: 'social-science-1', file: 'sst-01-the-rise-of-nationalism-in-europe.md', name: 'The Rise of Nationalism in Europe', unit: 'History' },
  { id: 'social-science-2', file: 'sst-02-nationalism-in-india.md', name: 'Nationalism in India', unit: 'History' },
  { id: 'social-science-3', file: 'sst-03-the-making-of-a-global-world.md', name: 'The Making of a Global World', unit: 'History' },
  { id: 'social-science-4', file: 'sst-04-the-age-of-industrialisation.md', name: 'The Age of Industrialisation', unit: 'History' },
  { id: 'social-science-5', file: 'sst-05-print-culture-and-the-modern-world.md', name: 'Print Culture and the Modern World', unit: 'History' },
  { id: 'social-science-6', file: 'sst-06-resources-and-development.md', name: 'Resources and Development', unit: 'Geography' },
  { id: 'social-science-7', file: 'sst-07-forest-and-wildlife-resources.md', name: 'Forest and Wildlife Resources', unit: 'Geography' },
  { id: 'social-science-8', file: 'sst-08-water-resources.md', name: 'Water Resources', unit: 'Geography' },
  { id: 'social-science-9', file: 'sst-09-agriculture.md', name: 'Agriculture', unit: 'Geography' },
  { id: 'social-science-10', file: 'sst-10-minerals-and-energy-resources.md', name: 'Minerals and Energy Resources', unit: 'Geography' },
  { id: 'social-science-11', file: 'sst-11-manufacturing-industries.md', name: 'Manufacturing Industries', unit: 'Geography' },
  { id: 'social-science-12', file: 'sst-12-lifelines-of-national-economy.md', name: 'Lifelines of National Economy', unit: 'Geography' },
  { id: 'social-science-13', file: 'sst-13-power-sharing.md', name: 'Power Sharing', unit: 'Civics' },
  { id: 'social-science-14', file: 'sst-14-federalism.md', name: 'Federalism', unit: 'Civics' },
  { id: 'social-science-15', file: 'sst-15-gender-religion-and-caste.md', name: 'Gender, Religion and Caste', unit: 'Civics' },
  { id: 'social-science-16', file: 'sst-16-political-parties.md', name: 'Political Parties', unit: 'Civics' },
  { id: 'social-science-17', file: 'sst-17-outcomes-of-democracy.md', name: 'Outcomes of Democracy', unit: 'Civics' },
  { id: 'social-science-18', file: 'sst-18-development.md', name: 'Development', unit: 'Economics' },
  { id: 'social-science-19', file: 'sst-19-sectors-of-the-indian-economy.md', name: 'Sectors of the Indian Economy', unit: 'Economics' },
  { id: 'social-science-20', file: 'sst-20-money-and-credit.md', name: 'Money and Credit', unit: 'Economics' },
  { id: 'social-science-21', file: 'sst-21-globalisation-and-the-indian-economy.md', name: 'Globalisation and the Indian Economy', unit: 'Economics' },
  { id: 'social-science-22', file: 'sst-22-consumer-rights.md', name: 'Consumer Rights', unit: 'Economics' },
];

function isTopSectionHeader(line) {
  return /^#{1,2}\s+(?:SECTION\s+\d+|Part\s+\d+|Chapter Metadata|Official Syllabus|\d+\.\s+|(?:15-Question|Multiple[- ]Choice|Comprehensive|MCQ|Verified|Practice Bank|Practice|Original Predicted|Master Chronology))/i.test(line);
}

function parseMCQs(sectionText, chapter) {
  const mcqs = [];
  const lines = sectionText.split(/\r?\n/);
  let current = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('```')) continue;

    // Support: "#### Q1. ...", "1. **...**", "**Q1.** ...", "#### 1. ...", "[1] ..."
    const qMatch = line.match(/^#{1,4}\s+Q?(\d+)[:.]\s*(.+)$/i) ||
                   line.match(/^(\d+)[:.]\s+\*\*(.+?)\*\*/i) ||
                   line.match(/^\*\*Q?(\d+)[:.]\s*(.+?)\*\*/i) ||
                   line.match(/^####\s+(?:Question|Q)\s*(\d+)[:.]?\s*(.+)$/i) ||
                   line.match(/^\[(\d+)\]\s*(.+)$/i);

    if (qMatch) {
      if (current && current.question && current.options.length >= 2) {
        mcqs.push(current);
      }
      const rawQ = qMatch[2].replace(/\*\*/g, '').trim();
      current = {
        id: `${chapter.id}-mcq-${qMatch[1]}`,
        subject_id: 'social-science',
        chapter_id: chapter.id,
        chapter_name: chapter.name,
        topic: chapter.unit,
        question: rawQ,
        options: [],
        correct_option: 'A',
        answer: '',
        explanation: '',
        solution: '',
        question_type: 'mcq',
        marks: 1,
        difficulty: 'medium',
        priority: 'must_do',
        is_pyq: false,
        is_predicted: false,
        is_premium: false,
      };
      continue;
    }

    if (!current) continue;

    // Inline options (A) ... (B) ...
    const inlineOpts = line.match(/\(([A-D])\)\s*([^()]+)/g);
    if (inlineOpts && inlineOpts.length >= 2) {
      for (const opt of inlineOpts) {
        const om = opt.match(/\(([A-D])\)\s*(.+)/i);
        if (om) current.options.push(`${om[1].toUpperCase()}) ${om[2].trim()}`);
      }
      continue;
    }

    // Line-by-line options
    const optMatch = line.match(/^\(([A-D])\)\s*(.+)$/i);
    if (optMatch) {
      current.options.push(`${optMatch[1].toUpperCase()}) ${optMatch[2].trim()}`);
      continue;
    }

    // Correct Answer
    const ansMatch = line.match(/(?:Correct Answer|Answer)\*{0,2}:\s*\*{0,2}\(?([A-D])\)?\s*([^*]*)\*{0,2}/i);
    if (ansMatch) {
      current.correct_option = ansMatch[1].toUpperCase();
      const answerVal = ansMatch[2] ? ansMatch[2].trim() : '';
      current.answer = answerVal || current.correct_option;
      continue;
    }

    // Explanation / Rationale / Note
    const expMatch = line.match(/(?:Explanation|Rationale|Note)\*{0,2}:\s*(.+)$/i);
    if (expMatch) {
      const expText = expMatch[1].replace(/^\*{1,2}|\*{1,2}$/g, '').trim();
      current.explanation = expText;
      current.solution = expText;
      continue;
    }
  }

  if (current && current.question && current.options.length >= 2) {
    mcqs.push(current);
  }

  return mcqs;
}

function parsePYQs(sectionText, chapter) {
  const pyqs = [];
  const lines = sectionText.split(/\r?\n/);
  let current = null;
  let inAnswer = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('```')) continue;

    // Headers: "### Question 1 (...)", "* **PYQ 1 (...)**", "#### PYQ 1"
    const qHeaderMatch = line.match(/^(?:#{2,4}\s+|\*\s+\*\*)(?:PYQ\s+|Question\s+)(\d+[A-Z]?)(?:\s*\(([^)]+)\))?(?:\s*\[(\d+)\s*Marks?\])?/i);
    if (qHeaderMatch) {
      if (current && current.question && (current.answer || current.options.length > 0)) {
        pyqs.push(current);
      }
      const rawInfo = qHeaderMatch[2] || '';
      const yearMatch = rawInfo.match(/20\d\d/);
      const year = yearMatch ? parseInt(yearMatch[0], 10) : 2024;
      const marks = qHeaderMatch[3] ? parseInt(qHeaderMatch[3], 10) : (rawInfo.includes('MCQ') ? 1 : 2);

      current = {
        id: `${chapter.id}-pyq-${qHeaderMatch[1].toLowerCase()}`,
        subject_id: 'social-science',
        chapter_id: chapter.id,
        chapter_name: chapter.name,
        topic: chapter.unit,
        question: '',
        answer: '',
        solution: '',
        options: [],
        correct_option: null,
        question_type: rawInfo.includes('MCQ') ? 'mcq' : marks === 1 ? 'very_short' : marks >= 3 ? 'long' : 'short',
        marks: marks,
        difficulty: marks >= 3 ? 'hard' : 'medium',
        priority: 'high_yield',
        year: year,
        source: rawInfo ? `BSER ${rawInfo}` : `BSER Past Paper (${year})`,
        is_pyq: true,
        is_predicted: false,
        is_premium: false,
      };
      inAnswer = false;
      continue;
    }

    if (!current) continue;

    const qBodyMatch = line.match(/(?:Question)\*{0,2}:\s*(.+)$/i);
    if (qBodyMatch) {
      current.question = qBodyMatch[1].trim();
      inAnswer = false;
      continue;
    }

    // Inline options for PYQ MCQs
    const inlineOpts = line.match(/\(([A-D])\)\s*([^()]+)/g);
    if (inlineOpts && inlineOpts.length >= 2) {
      for (const opt of inlineOpts) {
        const om = opt.match(/\(([A-D])\)\s*(.+)/i);
        if (om) current.options.push(`${om[1].toUpperCase()}) ${om[2].trim()}`);
      }
      current.question_type = 'mcq';
      continue;
    }

    const optMatch = line.match(/^\(([A-D])\)\s*(.+)$/i);
    if (optMatch) {
      current.options.push(`${optMatch[1].toUpperCase()}) ${optMatch[2].trim()}`);
      current.question_type = 'mcq';
      continue;
    }

    const ansMatch = line.match(/(?:Model Answer|Answer)\*{0,2}:\s*(.*)$/i);
    if (ansMatch) {
      const parsedAns = ansMatch[1] ? ansMatch[1].trim().replace(/^\*{1,2}|\*{1,2}$/g, '') : '';
      current.answer = parsedAns;
      current.solution = parsedAns;
      inAnswer = true;
      const optLetter = parsedAns.match(/\(([A-D])\)/i);
      if (optLetter) {
        current.correct_option = optLetter[1].toUpperCase();
      }
      continue;
    }

    const citeMatch = line.match(/(?:Grounding Citation|Citation|Source)\*{0,2}:\s*(.+)$/i);
    if (citeMatch) {
      current.source = citeMatch[1].replace(/^\*{1,2}|\*{1,2}$/g, '').trim();
      inAnswer = false;
      continue;
    }

    if (inAnswer) {
      if (line && !line.startsWith('---') && !line.startsWith('###') && !line.startsWith('* **PYQ')) {
        current.answer += (current.answer ? '\n' : '') + line;
        current.solution = current.answer;
      }
    } else if (current.question) {
      if (line && !line.startsWith('(') && !line.startsWith('*') && !line.startsWith('---') && !line.startsWith('#')) {
        current.question += ' ' + line;
      }
    }
  }

  if (current && current.question && (current.answer || current.options.length > 0)) {
    pyqs.push(current);
  }

  return pyqs;
}

function parsePracticeAndPredicted(sectionText, chapter, forcePredicted = false) {
  const items = [];
  const lines = sectionText.split(/\r?\n/);
  let current = null;
  let inAnswer = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('```')) continue;

    const qMatch = line.match(/^(?:#{2,4}\s+|\*\s+\*\*)(?:(?:Original\s+)?(Predicted|Practice)\s+)?Question\s+(\d+[A-Z]?)(?:\s*\(([^)]+)\))?(?:\s*\[(\d+)\s*Marks?\])?/i);
    if (qMatch) {
      if (current && current.question && current.answer) {
        items.push(current);
      }
      const kind = qMatch[1] ? qMatch[1].toLowerCase() : forcePredicted ? 'predicted' : 'practice';
      const isPred = kind === 'predicted' || forcePredicted;
      const marksMatch = (qMatch[3] || '').match(/(\d+)\s*Marks?/i);
      const marks = qMatch[4] ? parseInt(qMatch[4], 10) : marksMatch ? parseInt(marksMatch[1], 10) : 3;

      current = {
        id: `${chapter.id}-${isPred ? 'pred' : 'prac'}-${qMatch[2].toLowerCase()}`,
        subject_id: 'social-science',
        chapter_id: chapter.id,
        chapter_name: chapter.name,
        topic: chapter.unit,
        question: '',
        answer: '',
        solution: '',
        options: [],
        correct_option: null,
        question_type: marks === 1 ? 'very_short' : marks >= 3 ? 'long' : 'short',
        marks: marks,
        difficulty: isPred ? 'hard' : marks >= 3 ? 'medium' : 'easy',
        priority: isPred ? 'high_yield' : 'practice',
        year: 2027,
        source: isPred ? '2027 RBSE Blueprint Prediction' : 'RBSE Model Practice Bank',
        is_pyq: false,
        is_predicted: isPred,
        prediction_level: isPred ? 'High Probability' : null,
        prediction_reason: isPred ? 'Aligned with 2026-27 official RBSE question pattern & weightage' : null,
        is_premium: isPred,
      };
      inAnswer = false;
      continue;
    }

    if (!current) continue;

    const qBodyMatch = line.match(/(?:Question)\*{0,2}:\s*(.+)$/i);
    if (qBodyMatch) {
      current.question = qBodyMatch[1].trim();
      inAnswer = false;
      continue;
    }

    const ansMatch = line.match(/(?:Model Answer|Answer)\*{0,2}:\s*(.*)$/i);
    if (ansMatch) {
      const parsedAns = ansMatch[1] ? ansMatch[1].trim().replace(/^\*{1,2}|\*{1,2}$/g, '') : '';
      current.answer = parsedAns;
      current.solution = parsedAns;
      inAnswer = true;
      continue;
    }

    if (inAnswer) {
      if (line && !line.startsWith('---') && !line.startsWith('###') && !line.startsWith('* **')) {
        current.answer += (current.answer ? '\n' : '') + line;
        current.solution = current.answer;
      }
    } else if (current.question) {
      if (line && !line.startsWith('*') && !line.startsWith('---') && !line.startsWith('#')) {
        current.question += ' ' + line;
      }
    }
  }

  if (current && current.question && current.answer) {
    items.push(current);
  }

  return items;
}

function processAllChapters() {
  const allQuestions = [];
  let statMCQs = 0;
  let statPYQs = 0;
  let statPractice = 0;
  let statPredicted = 0;

  for (const ch of CHAPTERS) {
    const filePath = path.join(SST_DIR, ch.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }

    const markdown = fs.readFileSync(filePath, 'utf8');
    const lines = markdown.replace(/\r\n/g, '\n').split('\n');
    const sections = [];
    let cur = null;

    for (const line of lines) {
      if (isTopSectionHeader(line)) {
        if (cur) sections.push(cur);
        cur = { header: line.trim(), text: '' };
      } else if (cur) {
        cur.text += line + '\n';
      }
    }
    if (cur) sections.push(cur);

    sections.forEach((sec) => {
      const titleLower = sec.header.toLowerCase();

      if (titleLower.includes('mcq') || titleLower.includes('quiz') || titleLower.includes('multiple choice') || titleLower.includes('multiple-choice')) {
        const mcqs = parseMCQs(sec.text, ch);
        statMCQs += mcqs.length;
        allQuestions.push(...mcqs);
      } else if (titleLower.includes('pyq') || titleLower.includes('previous-year') || titleLower.includes('past')) {
        const pyqs = parsePYQs(sec.text, ch);
        statPYQs += pyqs.length;
        allQuestions.push(...pyqs);
      } else if (titleLower.includes('predicted') && !titleLower.includes('practice')) {
        const preds = parsePracticeAndPredicted(sec.text, ch, true);
        statPredicted += preds.length;
        allQuestions.push(...preds);
      } else if (titleLower.includes('practice') || titleLower.includes('predicted')) {
        const items = parsePracticeAndPredicted(sec.text, ch, titleLower.includes('predicted'));
        items.forEach((item) => {
          if (item.is_predicted) statPredicted++;
          else statPractice++;
        });
        allQuestions.push(...items);
      }
    });
  }

  console.log(`\n======================================================`);
  console.log(`=== Extraction Summary across 22 Social Science Chapters ===`);
  console.log(`======================================================`);
  console.log(`Total 15-MCQ Quiz Questions: ${statMCQs}`);
  console.log(`Total Past Year Questions (PYQs): ${statPYQs}`);
  console.log(`Total Practice Questions: ${statPractice}`);
  console.log(`Total 2027 Predicted Questions: ${statPredicted}`);
  console.log(`------------------------------------------------------`);
  console.log(`Total Generated Questions: ${allQuestions.length}`);
  console.log(`======================================================\n`);

  const fileContent = `// Auto-generated Social Science Question Pool
// Parsed directly from the 22 verified RBSE Social Science master content files.
// Contains 15-MCQ quizzes, verified past-year questions (PYQs), practice banks, and 2027 predicted questions.

export const SOCIAL_SCIENCE_QUESTIONS_POOL = ${JSON.stringify(allQuestions, null, 2)};
`;

  fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf8');
  console.log(`Successfully written pool to: ${OUTPUT_FILE}`);
}

processAllChapters();
