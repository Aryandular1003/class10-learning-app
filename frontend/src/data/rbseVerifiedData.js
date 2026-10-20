// Verified syllabus content packs for RBSE Class 10
// Mathematics - Chapter 1: Real Numbers (Real Numbers)
// Verified according to official RBSE Class 10 Mathematics syllabus (S-09) & NCERT.

export const RBSE_MATH_CH1_CONTENT = {
  chapter_id: 'math-1',
  subject_id: 'math',
  title: 'Real Numbers',
  overview: {
    board: 'RBSE (Board of Secondary Education, Rajasthan, Ajmer)',
    class: 'Class 10',
    subject: 'Mathematics',
    unit_name: 'Unit 1: Real Numbers',
    chapter_name: 'Chapter 1: Real Numbers',
    theory_marks_weightage: 4,
    total_theory_marks: 80,
    internal_sessional_marks: 20,
    grand_total: 100,
    prescribed_textbook: 'NCERT Mathematics Class 10',
    blueprint_breakdown: '4 Marks total: Typically 1 MCQ/VSA (1 Mark) + 1 Short Answer Question (3 Marks) OR 2 VSA (1 Mark each) + 1 Short Answer Question (2 Marks).',
    chapter_summary_hi: 'This chapter focuses on the Fundamental Theorem of Arithmetic, finding HCF and LCM by prime factorization method, the relation HCF(a,b) × LCM(a,b) = a × b, and proving the irrationality of irrational numbers of the type √2, √3, √5 and (a ± b√c).',
  },
  learning_objectives: [
    'Understanding the statement and application of the Fundamental Theorem of Arithmetic.',
    'Expressing any composite number in the product of exponential form of its prime factors.',
    'To find HCF and LCM of two or three positive integers by prime factorization method.',
    'Verify and apply the relation HCF(a,b) × LCM(a,b) = a × b for two positive integers a and b.',
    'To prove irrationality of numbers like √2, √3, √5 and (a ± b√c) by Method of Contradiction.',
  ],
  concepts: [
    {
      concept_title: 'Fundamental Theorem of Arithmetic',
      explanation: 'Every composite number can be expressed (factorized) as a product of prime numbers, and this factorization is unique regardless of the subsequent sequence of prime factors.',
    },
    {
      concept_title: 'Prime Factorization Method of HCF and LCM',
      explanation: 'HCF numbers are the product of the smallest power of each common prime factor. LCM is the product of the largest power of each prime factor associated with the numbers.',
    },
    {
      concept_title: 'Relationship between HCF and LCM',
      explanation: 'For any two positive integers a and b, HCF(a, b) × LCM(a, b) = a × b. This general formula does not apply for three or more numbers; That is, HCF(a,b,c) × LCM(a,b,c) cannot generally be considered equal to a × b × c.',
    },
    {
      concept_title: 'Proof of Irrationality',
      explanation: 'If p is a prime number and p divides a^2, then p will also divide a. It is used to prove irrationality by contradiction.',
    },
  ],
  definitions: [
    {
      term_hi: 'Natural Numbers',
      definition: 'The numbers {1, 2, 3, 4, ...} used in calculations are called natural numbers.',
    },
    {
      term_hi: 'Whole Numbers',
      definition: 'The set of zero and natural numbers {0, 1, 2, 3, ...} are called whole numbers.',
    },
    {
      term_hi: 'Integers',
      definition: 'The set of negative, zero and positive numbers {..., -3, -2, -1, 0, 1, 2, 3, ...} is called an integer.',
    },
    {
      term_hi: 'Rational Numbers',
      definition: 'Numbers that can be written in the form p/q, where p and q are integers and q ≠ 0.',
    },
    {
      term_hi: 'Irrational Numbers',
      definition: 'Real numbers that cannot be expressed in the form p/q, where p and q are integers and q ≠ 0 (e.g. √2, √3, π).',
    },
    {
      term_hi: 'Real Numbers',
      definition: 'The collection of all rational and irrational numbers is called real numbers (R).',
    },
    {
      term_hi: 'Prime Numbers',
      definition: 'Natural numbers greater than 1 are divisible only by 1 and itself (e.g. 2, 3, 5, 7, 11...).',
    },
    {
      term_hi: 'Composite Numbers',
      definition: 'Those natural numbers greater than 1 which are not prime and which have factors other than 1 and themselves.',
    },
    {
      term_hi: 'Co-prime Numbers',
      definition: 'Those two positive integers a and b such that HCF(a, b) = 1.',
    },
  ],
  formulas: [
    {
      formula_name: 'HCF and LCM product formula',
      expression: 'HCF(a, b) × LCM(a, b) = a × b',
      description: 'True only for two positive integers a and b.',
    },
    {
      formula_name: 'Formula to find LCM',
      expression: 'LCM(a, b) = (a × b) / HCF(a, b)',
      description: 'If a, b and HCF are known.',
    },
    {
      formula_name: 'Formula to find HCF',
      expression: 'HCF(a, b) = (a × b) / LCM(a, b)',
      description: 'If a, b and LCM are known.',
    },
  ],
  theorems_and_results: [
    {
      theorem_name: 'Fundamental theorem of arithmetic (Theorem 1.1)',
      statement: 'Every composite number can be expressed (factorized) as a product of prime numbers, and this factorization is unique regardless of the subsequent sequence of prime factors.',
    },
    {
      theorem_name: 'Prime Division Theorem (Theorem 1.2)',
      statement: 'Let p be a prime number. If p divides a^2, then p will also divide a, where a is a positive integer.',
    },
    {
      theorem_name: 'Irrationality Theorem (Theorem 1.3)',
      statement: '√2, √3, √5 are irrational numbers.',
    },
  ],
  common_mistakes: [
    {
      error_title: 'Writing HCF × LCM = a × b × c for three numbers',
      correction: 'The formula HCF(a,b) × LCM(a,b) = a × b is for two positive integers. There is no common general formula for three numbers HCF × LCM = a × b × c.',
    },
    {
      error_title: "Not writing the word 'co-prime' in the proof of irrationality",
      correction: "In Proof by Contradiction, it is mandatory to write a and b as 'Co-prime', otherwise marks are deducted.",
    },
    {
      error_title: 'Confusion of powers in HCF and LCM',
      correction: 'In HCF, the smallest degree of common factors is taken, whereas in LCM, the greatest degree of all prime factors is taken.',
    },
  ],
  exam_tips: [
    'While factoring, keep in mind the order of prime numbers (2, 3, 5, 7, 11, 13...) and write clearly in exponential form.',
    'In the problem of proving irrationality, clearly show all the steps - assumption, squaring, showing division and writing the contradiction.',
    'Be sure to write units (e.g. minutes, meters) in the answer when solving case-study or practical problems.',
  ],
  quick_revision: [
    'Fundamental Theorem of Arithmetic: Factorial number = unique product of prime factors.',
    'HCF = Product of lowest powers of common prime factors.',
    'LCM = Product of highest powers of all prime factors.',
    'For two numbers: HCF(a, b) × LCM(a, b) = a × b.',
    '√2, √3, √5 are irrational numbers.',
  ],
  one_hour_revision: [
    '1. Repeat by writing the prime factorization of 140, 156, 3825.',
    '2. Solve 1 question on the formula HCF(a,b) × LCM(a,b) = a × b.',
    '3. Try writing the complete answer to prove the irrationality of √5.',
    '4. Recall the step-by-step method of proving irrationality of the form (3 + 2√5).',
  ],
}
