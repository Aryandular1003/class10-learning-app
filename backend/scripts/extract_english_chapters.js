const fs = require('fs');
const path = require('path');

const promptFile = path.resolve(__dirname, '../../user_prompt_full.txt');
const content = fs.readFileSync(promptFile, 'utf8');

// Find all matches for "BoardReady Learning Package: RBSE Class 10 English (2026–27)"
const marker = 'BoardReady Learning Package: RBSE Class 10 English (2026–27)';
const splits = content.split(marker);

console.log('Found packages count:', splits.length - 1);

const packages = [];

splits.slice(1).forEach((part, index) => {
  const fullText = marker + part;
  // Clean up any trailing "Create the complete BoardReady..." prompt text from the next prompt
  const cleanText = fullText.split(/Create the complete BoardReady/i)[0].trim();
  
  // Extract Chapter ID
  const idMatch = cleanText.match(/Chapter ID:\s*([a-zA-Z0-9_-]+)/i);
  // Extract Title
  const titleMatch = cleanText.match(/Chapter Title:\s*([^\n\r]+)/i) || cleanText.match(/Title:\s*([^\n\r]+)/i);

  const chapterId = idMatch ? idMatch[1] : `english-unknown-${index + 1}`;
  const chapterTitle = titleMatch ? titleMatch[1].replace(/Subject ID.*/i, '').trim() : `Chapter ${index + 1}`;

  packages.push({
    index: index + 1,
    chapterId,
    chapterTitle,
    length: cleanText.length,
    content: cleanText
  });

  console.log(`Pkg ${index + 1}: ID=${chapterId}, Title=${chapterTitle}, Length=${cleanText.length}`);
});

fs.writeFileSync(path.resolve(__dirname, 'parsed_packages_summary.json'), JSON.stringify(packages.map(p => ({
  index: p.index,
  chapterId: p.chapterId,
  chapterTitle: p.chapterTitle,
  length: p.length
})), null, 2));
