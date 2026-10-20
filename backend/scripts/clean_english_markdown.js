const fs = require('fs');
const path = require('path');

function cleanMarkdown(raw) {
  let text = raw;

  // Insert newlines before major numbered sections
  text = text.replace(/([^\n])\s*(1\.\s*Syllabus Verification)/g, '$1\n\n## 1. Syllabus Verification');
  text = text.replace(/([^\n])\s*(2\.\s*Chapter Metadata)/g, '$1\n\n## 2. Chapter Metadata & Overview');
  text = text.replace(/([^\n])\s*(3\.\s*Detailed Section-Wise Explanations)/g, '$1\n\n## 3. Detailed Section-Wise Explanations');
  text = text.replace(/([^\n])\s*(4\.\s*Themes & Character Analysis|4\.\s*Themes, Character Analysis|4\.\s*Themes & Cultural Analysis|4\.\s*Themes & Character\/Animal Profiles|4\.\s*Themes & Character \/ Spiritual Analysis)/g, '$1\n\n## 4. Themes & Character Analysis');
  text = text.replace(/([^\n])\s*(5\.\s*Important Vocabulary)/g, '$1\n\n## 5. Important Vocabulary');
  text = text.replace(/([^\n])\s*(6\.\s*Verified Previous-Year)/g, '$1\n\n## 6. Verified Previous-Year & Official Model Paper Questions');
  text = text.replace(/([^\n])\s*(7\.\s*Generated Practice Questions)/g, '$1\n\n## 7. Generated Practice Questions');
  text = text.replace(/([^\n])\s*(8\.\s*15-Question MCQ Quiz)/g, '$1\n\n## 8. 15-Question MCQ Quiz');
  text = text.replace(/([^\n])\s*(9\.\s*Syllabus Coverage Checklist)/g, '$1\n\n## 9. Syllabus Coverage Checklist & Source References');

  // Insert newlines before subsections
  text = text.replace(/([^\n])\s*(Section \d+:[^\n]+)/g, '$1\n\n### $2\n');
  text = text.replace(/([^\n])\s*(Part [I|V|X]+:[^\n]+)/g, '$1\n\n### $2\n');
  text = text.replace(/([^\n])\s*(Scene \d+:[^\n]+)/g, '$1\n\n### $2\n');

  // Format MCQs properly with newlines
  text = text.replace(/([^\n])\s*(\(A\)\s*)/g, '$1\n(A) ');
  text = text.replace(/([^\n])\s*(\(B\)\s*)/g, '$1\n(B) ');
  text = text.replace(/([^\n])\s*(\(C\)\s*)/g, '$1\n(C) ');
  text = text.replace(/([^\n])\s*(\(D\)\s*)/g, '$1\n(D) ');
  text = text.replace(/([^\n])\s*(Answer:\s*\([A-D]\)[^\n]*)/g, '$1\n$2\n\n');

  // Format Questions and Model Answers
  text = text.replace(/([^\n])\s*(Question:\s*)/g, '$1\n\n**Question:** ');
  text = text.replace(/([^\n])\s*(Model Answer:\s*)/g, '$1\n**Model Answer:** ');

  // Clean trailing citation noise
  text = text.replace(/\[cite:\s*[\d,\s]+\]/g, '');
  text = text.replace(/more_horiz/g, '');

  return text;
}

const dir = path.resolve(__dirname, '../../frontend/public/content/english');
const targetDir = 'C:/Users/aryan/OneDrive/Desktop/RBSE CLASS 10 content/ENGLISH/chapters';

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.md')) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const cleaned = cleanMarkdown(raw);
    fs.writeFileSync(path.join(dir, file), cleaned, 'utf8');
    fs.writeFileSync(path.join(targetDir, file), cleaned, 'utf8');
    console.log(`Cleaned and formatted: ${file}`);
  }
});
