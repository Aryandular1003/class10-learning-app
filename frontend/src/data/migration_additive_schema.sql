-- ==============================================================================
-- BOARDREADY - CLASS 10 RBSE ADDITIVE SCHEMA EXTENSION (COMPATIBLE MIGRATION)
-- ==============================================================================
-- This SQL is strictly ADDITIVE:
-- 1. Preserves existing tables: subjects, chapters, content_items, student_progress, profiles
-- 2. Preserves TEXT primary keys and foreign keys (subjects.id, chapters.id)
-- 3. Creates missing entities: questions, question_options, pyqs, predicted_questions,
--    quizzes, quiz_questions, mock_tests, mock_test_questions, quiz_attempts
-- ==============================================================================

-- 1. QUESTIONS TABLE (TEXT ID compatible with subjects.id and chapters.id)
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter_id TEXT REFERENCES public.chapters(id) ON DELETE CASCADE,
  topic TEXT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  detailed_explanation TEXT,
  keywords JSONB DEFAULT '[]'::jsonb,
  solution_steps JSONB,
  options JSONB, -- For quick MCQ storage: ["A) ...", "B) ..."]
  correct_option TEXT,
  question_type TEXT NOT NULL, -- 'mcq', 'very_short', 'short', 'long', 'numerical', 'assertion_reason', 'case_based', 'source_based', 'diagram_based', 'practice'
  marks INTEGER NOT NULL DEFAULT 1,
  difficulty TEXT NOT NULL DEFAULT 'medium', -- 'easy', 'medium', 'hard'
  priority TEXT NOT NULL DEFAULT 'practice', -- 'must_do', 'important', 'practice'
  source TEXT,
  year INTEGER,
  is_pyq BOOLEAN DEFAULT false,
  is_predicted BOOLEAN DEFAULT false,
  prediction_level TEXT, -- 'Very High', 'High', 'Moderate'
  prediction_reason TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. QUESTION OPTIONS TABLE (Normalized options for MCQ if required)
CREATE TABLE IF NOT EXISTS public.question_options (
  id TEXT PRIMARY KEY,
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  option_letter TEXT NOT NULL, -- 'A', 'B', 'C', 'D'
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PYQs TABLE (Dedicated Previous Year Questions catalog)
CREATE TABLE IF NOT EXISTS public.pyqs (
  id TEXT PRIMARY KEY,
  question_id TEXT REFERENCES public.questions(id) ON DELETE SET NULL,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter_id TEXT REFERENCES public.chapters(id) ON DELETE CASCADE,
  topic TEXT,
  year INTEGER NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  marks INTEGER NOT NULL DEFAULT 1,
  question_type TEXT NOT NULL,
  source TEXT,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. PREDICTED QUESTIONS TABLE (Dedicated high-probability board question entity)
CREATE TABLE IF NOT EXISTS public.predicted_questions (
  id TEXT PRIMARY KEY,
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter_id TEXT REFERENCES public.chapters(id) ON DELETE CASCADE,
  topic TEXT,
  prediction_level TEXT NOT NULL, -- 'Very High', 'High', 'Moderate'
  prediction_reason TEXT NOT NULL,
  related_pyq_ids JSONB DEFAULT '[]'::jsonb,
  expected_marks INTEGER NOT NULL DEFAULT 1,
  is_premium BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. QUIZZES TABLE (Chapter quiz, Subject quiz, Practice quiz)
CREATE TABLE IF NOT EXISTS public.quizzes (
  id TEXT PRIMARY KEY,
  chapter_id TEXT REFERENCES public.chapters(id) ON DELETE CASCADE,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  total_marks INTEGER NOT NULL DEFAULT 10,
  duration_minutes INTEGER NOT NULL DEFAULT 15,
  quiz_type TEXT DEFAULT 'chapter_quiz', -- 'chapter_quiz', 'subject_quiz', 'practice_quiz'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. QUIZ QUESTIONS LINK TABLE
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  quiz_id TEXT REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (quiz_id, question_id)
);

-- 7. MOCK TESTS TABLE (Chapter test, Subject test, Full Mock test)
CREATE TABLE IF NOT EXISTS public.mock_tests (
  id TEXT PRIMARY KEY,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  level TEXT NOT NULL, -- 'Chapter Test', 'Subject Test', 'Full Mock Test'
  total_marks INTEGER NOT NULL DEFAULT 80,
  duration_minutes INTEGER NOT NULL DEFAULT 195, -- 3 hours 15 mins for RBSE board
  difficulty TEXT NOT NULL DEFAULT 'medium',
  is_premium BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. MOCK TEST QUESTIONS LINK TABLE
CREATE TABLE IF NOT EXISTS public.mock_test_questions (
  mock_test_id TEXT REFERENCES public.mock_tests(id) ON DELETE CASCADE,
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (mock_test_id, question_id)
);

-- 9. QUIZ ATTEMPTS TABLE (Student performance & accuracy tracker)
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id TEXT REFERENCES public.quizzes(id) ON DELETE SET NULL,
  score INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  incorrect_count INTEGER NOT NULL,
  attempted_count INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predicted_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Read policies for public study content
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read questions for all authenticated or anon') THEN
    CREATE POLICY "Allow read questions for all authenticated or anon"
      ON public.questions FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read question_options for all') THEN
    CREATE POLICY "Allow read question_options for all"
      ON public.question_options FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read pyqs for all') THEN
    CREATE POLICY "Allow read pyqs for all"
      ON public.pyqs FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read predicted_questions for all') THEN
    CREATE POLICY "Allow read predicted_questions for all"
      ON public.predicted_questions FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read quizzes for all') THEN
    CREATE POLICY "Allow read quizzes for all"
      ON public.quizzes FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read quiz_questions for all') THEN
    CREATE POLICY "Allow read quiz_questions for all"
      ON public.quiz_questions FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read mock_tests for all') THEN
    CREATE POLICY "Allow read mock_tests for all"
      ON public.mock_tests FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read mock_test_questions for all') THEN
    CREATE POLICY "Allow read mock_test_questions for all"
      ON public.mock_test_questions FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Students can manage their own quiz attempts') THEN
    CREATE POLICY "Students can manage their own quiz attempts"
      ON public.quiz_attempts FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
