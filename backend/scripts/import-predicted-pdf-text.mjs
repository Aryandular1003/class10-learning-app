import fs from 'node:fs'

function clean(value) {
  return value.replaceAll('\\n', '\n').replace(/\u0000/g, '').replace(/\(\s*\)/g, '').replace(/\n{3,}/g, '\n\n').trim()
}

function parse(file, subject, chapterId) {
  const text = clean(fs.readFileSync(file, 'utf8'))
  const matches = [...text.matchAll(/(?:^|\n)Q(\d+)\.(?=\s)/g)]
  return matches.map((match, index) => {
    const start = match.index + match[0].lastIndexOf('Q')
    const end = index + 1 < matches.length ? matches[index + 1].index : text.length
    const block = text.slice(start, end).trim()
    const marker = block.search(/\n(?=(?:Model Answer(?: \/ Solution| \/ Marking Scheme)?|Complete Model Solution|Model Solution|Ans:|Answer:))/i)
    const question = (marker >= 0 ? block.slice(0, marker) : block).trim()
    const solution = (marker >= 0
      ? block.slice(marker).replace(/^\n+/, '').replace(/^(?:Model Answer(?: \/ Solution| \/ Marking Scheme)?|Complete Model Solution|Model Solution|Ans(?:wer)?):\s*/i, '')
      : 'See the source predicted-question solution.').trim()
    const optionMatches = [...question.matchAll(/(?:^|\s)[(]?([A-D])\)?\s+([^\n]+?)(?=\s+[(]?[A-D]\)?\s+|$)/gm)]
    const options = optionMatches.map((option) => `${option[1]}) ${option[2].trim()}`)
    const answer = (solution.match(/^(?:\(?[A-D]\)?\s*)?([^\n]+)/i)?.[1] || solution.split('\n')[0]).trim()
    const correct = answer.match(/\(([A-D])\)/i)?.[1]?.toUpperCase() || null
    const number = match[1]
    return {
      id: `${subject}-pdf-predicted-${number}`,
      subject_id: subject,
      chapter_id: chapterId,
      chapter_name: 'Predicted Board Question Bank 2026-27',
      topic: 'PDF predicted question bank',
      question,
      answer,
      solution,
      ...(options.length >= 2 ? { options, correct_option: correct } : {}),
      question_type: options.length >= 2 ? 'mcq' : 'short_answer',
      marks: Number(question.match(/(\d+)\s*Marks?/i)?.[1] || 3),
      difficulty: 'hard',
      priority: 'must_do',
      source: 'User-provided RBSE Class 10 predicted-question PDF',
      is_pyq: false,
      is_predicted: true,
      is_premium: false,
    }
  })
}

const questions = [
  ...parse('tmp/pdfs/english.txt', 'english', 'english-predicted'),
  ...parse('tmp/pdfs/science.txt', 'science', 'science-predicted'),
  ...parse('tmp/pdfs/sst.txt', 'social-science', 'social-science-predicted'),
]
fs.writeFileSync('frontend/src/data/pdfPredictedQuestions.js', `// Imported from the user-provided RBSE predicted-question PDFs.\nexport const PDF_PREDICTED_QUESTIONS = ${JSON.stringify(questions, null, 2)}\n`)
console.log(`Imported ${questions.length} PDF predicted questions.`)
