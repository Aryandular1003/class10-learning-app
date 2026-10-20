// Scalable Class 10 RBSE content catalogue.
// Content is deliberately data-driven so the future API can replace this file
// without changing the screens or progress logic.

export const SUBJECTS = [
  { id: 'science', label: 'Science', emoji: '🧪', shortLabel: 'Science' },
  { id: 'math', label: 'Mathematics', emoji: '📐', shortLabel: 'Math' },
  { id: 'english', label: 'English', emoji: '📖', shortLabel: 'English' },
  { id: 'social-science', label: 'Social Science', emoji: '🌍', shortLabel: 'Social Science' },
]
export const SUPPORTED_SUBJECT_IDS = ['science', 'math', 'english', 'social-science']

export const SUBJECT_PARTS = {
  science: [
    { id: 'chemistry', label: 'Chemistry', description: 'Chemical substances', chapterIds: ['science-1', 'science-2', 'science-3', 'science-4'] },
    { id: 'biology', label: 'Biology', description: 'World of living', chapterIds: ['science-5', 'science-6', 'science-7', 'science-8'] },
    { id: 'physics-environment', label: 'Physics & Environment', description: 'Physics phenomena and natural resources', chapterIds: ['science-9', 'science-10', 'science-11', 'science-12', 'science-13'] },
  ],
  math: [
    { id: 'number-algebra', label: 'Number System & Algebra', description: 'Core algebra and sequences', chapterIds: ['math-1', 'math-2', 'math-3', 'math-4', 'math-5'] },
    { id: 'geometry-trigonometry', label: 'Geometry & Trigonometry', description: 'Theorems, coordinates and applications', chapterIds: ['math-6', 'math-7', 'math-8', 'math-9', 'math-10'] },
    { id: 'mensuration-statistics', label: 'Mensuration & Statistics', description: 'Areas, volumes, data and probability', chapterIds: ['math-11', 'math-12', 'math-13', 'math-14'] },
  ],
  english: [
    { id: 'first-flight', label: 'First Flight Prose', description: 'Stories and prose lessons', chapterIds: ['english-1', 'english-2', 'english-3', 'english-4', 'english-5', 'english-6', 'english-7', 'english-8', 'english-9'] },
    { id: 'poetry', label: 'Poetry', description: 'Poems and poetic devices', chapterIds: ['english-10', 'english-11'] },
    { id: 'footprints-language', label: 'Footprints & Language', description: 'Supplementary reader, grammar and writing', chapterIds: ['english-12', 'english-13', 'english-14', 'english-15', 'english-16', 'english-17', 'english-18', 'english-19', 'english-20', 'english-21', 'english-22'] },
  ],
  'social-science': [
    { id: 'history', label: 'History', description: 'India and the modern world', chapterIds: ['social-science-1', 'social-science-2', 'social-science-3', 'social-science-4', 'social-science-5'] },
    { id: 'geography', label: 'Geography', description: 'Resources, agriculture and industries', chapterIds: ['social-science-6', 'social-science-7', 'social-science-8', 'social-science-9', 'social-science-10', 'social-science-11', 'social-science-12'] },
    { id: 'civics', label: 'Civics', description: 'Democracy and political institutions', chapterIds: ['social-science-13', 'social-science-14', 'social-science-15', 'social-science-16', 'social-science-17'] },
    { id: 'economics', label: 'Economics', description: 'Development and the Indian economy', chapterIds: ['social-science-18', 'social-science-19', 'social-science-20', 'social-science-21', 'social-science-22'] },
  ],
}

export const SUBJECT_CHAPTERS = {
  science: [
    'Chemical Reactions & Equations',
    'Acids, Bases & Salts',
    'Metals & Non-Metals',
    'Carbon & Its Compounds',
    'Life Processes',
    'Control & Coordination',
    'How do Organisms Reproduce?',
    'Heredity',
    'Light — Reflection & Refraction',
    'The Human Eye & Colorful World',
    'Electricity',
    'Magnetic Effects of Electric Current',
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
    'A Question of Trust',
    'Footprints Without Feet (Supplementary Reader)',
    'The Making of a Scientist',
    'The Necklace',
    'Bholi (Complete Supplementary Reader)',
    'The Book That Saved the Earth',
  ],
  'social-science': [
    'The Rise of Nationalism in Europe',
    'Nationalism in India',
    'The Making of a Global World',
    'The Age of Industrialisation',
    'Print Culture and the Modern World',
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
    'Outcomes of Democracy',
    'Development',
    'Sectors of the Indian Economy',
    'Money and Credit',
    'Globalisation and the Indian Economy',
    'Consumer Rights',
  ],
}

const WEIGHTS = {
  science: [3, 6, 5, 7, 8, 6, 7, 4, 8, 4, 7, 6, 5],
  math: [8, 7, 8, 8, 9, 10, 7, 8, 7, 7, 6, 8, 9, 4],
  english: [7, 7, 6, 6, 7, 5, 6, 6, 6, 5, 5, 5, 5, 5, 5, 12, 5, 5, 5, 5, 5, 5],
  'social-science': [4, 4, 4, 4, 4, 3, 2, 3, 5, 2, 3, 4, 4, 4, 4, 5, 3, 5, 5, 5, 5, 4],
}

export const CONTENT_TYPES = ['notes', 'pyq', 'practice', 'predicted']
export const REVIEW_STATUSES = ['draft', 'in-review', 'approved']

export const SUBJECT_CATALOGUE = Object.fromEntries(
  SUBJECTS.map((subject) => [subject.id, SUBJECT_CHAPTERS[subject.id].map((name, index) => ({
    id: `${subject.id}-${index + 1}`,
    subjectId: subject.id,
    name,
    weight: WEIGHTS[subject.id][index] || 5,
    partId: SUBJECT_PARTS[subject.id]?.find((part) => part.chapterIds.includes(`${subject.id}-${index + 1}`))?.id || null,
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

export function getSubjectParts(subjectId) {
  return SUBJECT_PARTS[subjectId] || [{ id: 'all', label: 'All chapters', description: '', chapterIds: [] }]
}
