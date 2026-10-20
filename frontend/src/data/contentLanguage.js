// Student-facing question content must stay in English. Some imported legacy
// records contain Hindi translations mixed into otherwise valid questions.
export function containsHindi(value) {
  return /[\u0900-\u097F]/.test(String(value || ''))
}

export function isEnglishQuestion(question) {
  return !containsHindi([
    question?.question,
    question?.answer,
    question?.solution,
    question?.detailed_explanation,
    ...(question?.options || []),
  ].join(' '))
}
