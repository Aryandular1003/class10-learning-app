// Source manifest for the complete RBSE Class 10 Social Science content set.
// The markdown files live in public/content/social-science so the same content
// works locally, on Vercel, and as an offline-friendly fallback in the reader.

export const SOCIAL_SCIENCE_CONTENT = [
  ['social-science-1', 'sst-01-the-rise-of-nationalism-in-europe.md', 'History'],
  ['social-science-2', 'sst-02-nationalism-in-india.md', 'History'],
  ['social-science-3', 'sst-03-the-making-of-a-global-world.md', 'History'],
  ['social-science-4', 'sst-04-the-age-of-industrialisation.md', 'History'],
  ['social-science-5', 'sst-05-print-culture-and-the-modern-world.md', 'History'],
  ['social-science-6', 'sst-06-resources-and-development.md', 'Geography'],
  ['social-science-7', 'sst-07-forest-and-wildlife-resources.md', 'Geography'],
  ['social-science-8', 'sst-08-water-resources.md', 'Geography'],
  ['social-science-9', 'sst-09-agriculture.md', 'Geography'],
  ['social-science-10', 'sst-10-minerals-and-energy-resources.md', 'Geography'],
  ['social-science-11', 'sst-11-manufacturing-industries.md', 'Geography'],
  ['social-science-12', 'sst-12-lifelines-of-national-economy.md', 'Geography'],
  ['social-science-13', 'sst-13-power-sharing.md', 'Civics'],
  ['social-science-14', 'sst-14-federalism.md', 'Civics'],
  ['social-science-15', 'sst-15-gender-religion-and-caste.md', 'Civics'],
  ['social-science-16', 'sst-16-political-parties.md', 'Civics'],
  ['social-science-17', 'sst-17-outcomes-of-democracy.md', 'Civics'],
  ['social-science-18', 'sst-18-development.md', 'Economics'],
  ['social-science-19', 'sst-19-sectors-of-the-indian-economy.md', 'Economics'],
  ['social-science-20', 'sst-20-money-and-credit.md', 'Economics'],
  ['social-science-21', 'sst-21-globalisation-and-the-indian-economy.md', 'Economics'],
  ['social-science-22', 'sst-22-consumer-rights.md', 'Economics'],
].map(([chapterId, file, unit]) => ({ chapterId, file, unit }))

export function getSocialScienceSource(chapterId) {
  return SOCIAL_SCIENCE_CONTENT.find((item) => item.chapterId === chapterId) || null
}

export function parseSocialScienceMarkdown(markdown, chapter) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const sections = []
  let current = null
  const pushCurrent = () => {
    if (current && (current.content.trim() || current.heading)) {
      current.content = current.content.trim()
      sections.push(current)
    }
  }

  lines.forEach((line) => {
    const heading = line.match(/^#{2,4}\s+(.+)$/)
    if (heading) {
      pushCurrent()
      current = { heading: heading[1].replace(/[`*_]/g, ''), content: '' }
      return
    }
    if (!current) return
    current.content += `${line}\n`
  })
  pushCurrent()

  const title = lines.find((line) => /^#\s+/.test(line))?.replace(/^#\s+/, '').trim() || chapter.name
  return {
    title,
    subject: 'Social Science',
    unit: getSocialScienceSource(chapter.id)?.unit,
    weight: chapter.weight,
    readTime: '15 mins',
    sections: sections.length ? sections : [{ heading: 'Complete Chapter Content', content: markdown }],
    sourceFile: getSocialScienceSource(chapter.id)?.file,
  }
}
