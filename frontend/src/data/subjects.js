// Scalable Class 10 RBSE content catalogue.
// Content is deliberately data-driven so the future API can replace this file
// without changing the screens or progress logic.

export const SUBJECTS = [
  { id: 'science', label: 'Science', emoji: '🧪', shortLabel: 'Science' },
  { id: 'math', label: 'Mathematics', emoji: '📐', shortLabel: 'Math' },
  { id: 'english', label: 'English', emoji: '📖', shortLabel: 'English' },
  { id: 'social-science', label: 'Social Science', emoji: '🌍', shortLabel: 'Social Science' },
]

export const SUBJECT_CHAPTERS = {
  science: [
    'Light — Reflection & Refraction',
    'Electricity',
    'Chemical Reactions & Equations',
    'Life Processes',
    'Magnetic Effects of Electric Current',
    'Carbon & Its Compounds',
    'Heredity & Evolution',
    'Acids, Bases & Salts',
    'Metals & Non-Metals',
    'Control & Coordination',
    'How do Organisms Reproduce?',
    'The Human Eye & Colorful World',
    'Our Environment',
  ],
  math: [
    'Real Numbers',
    'Polynomials',
    'Pair of Linear Equations',
    'Quadratic Equations',
    'Arithmetic Progressions',
    'Triangles',
    'Coordinate Geometry',
    'Introduction to Trigonometry',
    'Applications of Trigonometry',
    'Circles',
    'Areas Related to Circles',
    'Surface Areas & Volumes',
    'Statistics',
    'Probability',
  ],
  english: [
    'A Letter to God',
    'Nelson Mandela — Long Walk to Freedom',
    'Two Stories About Flying',
    'From the Diary of Anne Frank',
    'Glimpses of India',
    'Mijbil the Otter',
    'Madam Rides the Bus',
    'The Sermon at Benares',
    'The Proposal',
    'Dust of Snow & Fire and Ice',
    'A Tiger in the Zoo & Amanda!',
    'A Triumph of Surgery',
    'The Thief\'s Story',
    'Footprints Without Feet',
    'Bholi',
    'Grammar & Writing Skills',
  ],
  'social-science': [
    'The Rise of Nationalism in Europe',
    'Nationalism in India',
    'The Making of a Global World',
    'Print Culture & Modern World',
    'Resources and Development',
    'Forest and Wildlife Resources',
    'Water Resources',
    'Agriculture',
    'Minerals and Energy Resources',
    'Manufacturing Industries',
    'Lifelines of National Economy',
    'Power Sharing',
    'Federalism',
    'Gender, Religion and Caste',
    'Political Parties',
    'Development',
    'Sectors of the Indian Economy',
    'Money and Credit',
  ],
}

const WEIGHTS = {
  science: [10, 9, 8, 9, 7, 8, 6, 8, 9, 7, 7, 6, 6],
  math: [8, 7, 8, 8, 9, 10, 7, 8, 7, 7, 6, 8, 9, 4],
  english: [7, 7, 6, 6, 7, 5, 6, 6, 6, 5, 5, 5, 5, 5, 5, 12],
  'social-science': [7, 9, 5, 5, 6, 5, 5, 7, 6, 6, 5, 6, 6, 5, 6, 5, 5, 5],
}

export const CONTENT_TYPES = ['notes', 'pyq', 'practice', 'predicted']
export const REVIEW_STATUSES = ['draft', 'in-review', 'approved']

export const SUBJECT_CATALOGUE = Object.fromEntries(
  SUBJECTS.map((subject) => [subject.id, SUBJECT_CHAPTERS[subject.id].map((name, index) => ({
    id: `${subject.id}-${index + 1}`,
    subjectId: subject.id,
    name,
    weight: WEIGHTS[subject.id][index] || 5,
    locked: index > 3,
    reviewStatus: 'approved',
    content: CONTENT_TYPES.map((type) => ({ type, status: 'approved' })),
  }))]),
)

export const CONTENT_REVIEW_ITEMS = Object.values(SUBJECT_CATALOGUE).flatMap((chapters) =>
  chapters.flatMap((chapter) => chapter.content.map((item) => ({
    id: `${chapter.id}-${item.type}`,
    subjectId: chapter.subjectId,
    chapterId: chapter.id,
    chapterName: chapter.name,
    type: item.type,
    defaultStatus: item.status,
  }))),
)

export function getSubject(subjectId) {
  return SUBJECTS.find((subject) => subject.id === subjectId) || SUBJECTS[0]
}
