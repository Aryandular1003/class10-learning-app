// Deeply researched Class 10 RBSE Board Exam notes repository for Science, Math, English, and Social Science.

export const CHAPTER_NOTES = {
  // ─── SCIENCE ─────────────────────────────────────────────────────────────
  'science-1': {
    title: 'Light — Reflection & Refraction',
    subject: 'Science',
    weight: 10,
    readTime: '8 mins',
    sections: [
      {
        heading: '1. Reflection of Light & Fundamental Laws',
        content: `Light is an electromagnetic radiation that produces the sensation of vision in our eyes. When light hits a polished shiny surface (like a plane mirror), it bounces back into the same medium. This phenomenon is called **reflection of light**.`,
        keyBox: {
          title: '⚡ Essential Laws & Formulas',
          items: [
            '**First Law of Reflection:** Angle of incidence (∠i) = Angle of reflection (∠r).',
            '**Second Law of Reflection:** Incident ray, reflected ray, and normal at point of incidence all lie in the same plane.',
            '**Focal Length Relation:** f = R / 2 (where R is radius of curvature).',
          ],
        },
      },
      {
        heading: '2. Spherical Mirrors (Concave & Convex)',
        content: `Spherical mirrors have curved reflecting surfaces.
- **Concave Mirror (Converging):** Reflecting surface curves inward. Used in headlights, solar furnaces, shaving mirrors, and dental examinations.
- **Convex Mirror (Diverging):** Reflecting surface curves outward. Always forms virtual, erect, and diminished images. Used as rear-view mirrors in vehicles due to wider field of view.`,
        formulaBox: {
          title: 'Mirror Formula & Magnification',
          formula: '1/f = 1/v + 1/u',
          subtext: 'Magnification (m) = -v / u = h\' / h (Where h\' = image height, h = object height)',
        },
      },
      {
        heading: '3. Refraction of Light & Lenses',
        content: `Bending of light ray when it passes obliquely from one transparent medium to another of different optical density.
- **Rayer to Denser Medium:** Light bends towards the normal (speed decreases).
- **Denser to Rarer Medium:** Light bends away from the normal (speed increases).
- **Snell's Law of Refraction:** sin(i) / sin(r) = n₂₁ (Refractive Index of medium 2 w.r.t. medium 1).`,
        formulaBox: {
          title: 'Lens Formula & Power of Lens',
          formula: '1/f = 1/v - 1/u  |  P = 1 / f (in metres)',
          subtext: 'SI Unit of Lens Power = Dioptre (D). Convex lens power is positive (+D); Concave lens power is negative (-D).',
        },
      },
      {
        heading: '4. Top Board Exam Traps & Common Mistakes',
        content: `1. **Sign Convention Warning:** Object distance (u) is ALWAYS negative in both mirrors and lenses.
2. **Concave Mirror Image:** Virtual image is formed ONLY when object is placed between Focus (F) and Pole (P).
3. **Power Calculation:** Always convert focal length to metres before calculating P = 1/f.`,
      },
    ],
  },

  'science-2': {
    title: 'Electricity',
    subject: 'Science',
    weight: 9,
    readTime: '10 mins',
    sections: [
      {
        heading: '1. Electric Current & Potential Difference',
        content: `Electric current (I) is the rate of flow of electric charges (electrons) through a conductor.
Formula: I = Q / t (where Q = net charge in Coulombs, t = time in seconds).
SI Unit: Ampere (A). 1 Ampere = 1 Coulomb / 1 Second.
Potential Difference (V) between two points is work done in moving a unit charge: V = W / Q. SI Unit: Volt (V).`,
        keyBox: {
          title: '⚡ Ohm\'s Law (Most Important Board Concept)',
          items: [
            '**Statement:** At constant temperature, electric current flowing through a metallic conductor is directly proportional to potential difference across its ends.',
            '**Mathematical Form:** V ∝ I  ⇒  V = I × R (where R is electric resistance).',
            '**Resistance Factors:** R = ρ × (L / A) where ρ (rho) is resistivity of material, L is length, A is cross-sectional area.',
          ],
        },
      },
      {
        heading: '2. Combination of Resistors',
        content: `- **Series Combination:** Resistors connected end to end. Current (I) remains SAME through each resistor, Voltage (V) splits.
Equivalent Resistance: R_s = R₁ + R₂ + R₃ + ...
- **Parallel Combination:** Resistors connected between common points. Voltage (V) remains SAME across each resistor, Current (I) splits.
Equivalent Resistance: 1 / R_p = 1/R₁ + 1/R₂ + 1/R₃ + ...`,
        formulaBox: {
          title: 'Joule\'s Law of Heating & Electric Power',
          formula: 'H = I² × R × t  |  P = V × I = I² × R = V² / R',
          subtext: 'Commercial Unit of Energy: 1 kWh = 3.6 × 10⁶ Joules (1 Unit of Electricity).',
        },
      },
      {
        heading: '3. Solved Board Numerical Example',
        content: `**Question:** An electric iron of resistance 20 Ω takes a current of 5 A. Calculate heat developed in 30 seconds.
**Solution:**
Given: R = 20 Ω, I = 5 A, t = 30 s.
Using H = I² R t = (5)² × 20 × 30 = 25 × 20 × 30 = 15,000 Joules = 15 kJ.`,
      },
    ],
  },

  'science-3': {
    title: 'Chemical Reactions & Equations',
    subject: 'Science',
    weight: 8,
    readTime: '7 mins',
    sections: [
      {
        heading: '1. Chemical Reactions & Balancing Equations',
        content: `A chemical reaction is a process in which one or more substances (reactants) transform into new substances (products) with different properties.
Law of Conservation of Mass: Mass can neither be created nor destroyed in a chemical reaction. Therefore, number of atoms of each element must remain equal on both sides of a balanced equation.`,
        keyBox: {
          title: '🧪 Types of Chemical Reactions',
          items: [
            '**Combination:** Two or more reactants combine to form a single product. (e.g., CaO + H₂O → Ca(OH)₂ + Heat)',
            '**Decomposition:** A single reactant breaks down into simpler products using Heat (Thermal), Light (Photolytic), or Electricity (Electrolytic).',
            '**Displacement:** A more reactive element displaces a less reactive element from its compound. (e.g., Fe + CuSO₄ → FeSO₄ + Cu)',
            '**Double Displacement:** Exchange of ions between reactants forming insoluble precipitate. (e.g., Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl)',
            '**Redox Reactions:** Oxidation (gain of oxygen / loss of hydrogen) and Reduction (loss of oxygen / gain of hydrogen) occur simultaneously.',
          ],
        },
      },
      {
        heading: '2. Corrosion and Rancidity',
        content: `- **Corrosion:** Process in which metals are gradually eaten away by action of air, moisture, or chemicals. Example: Rusting of iron (Fe₂O₃·xH₂O), green coating on copper (CuCO₃·Cu(OH)₂).
- **Rancidity:** Oxidation of fats and oils in food resulting in bad smell and taste. Prevented by adding antioxidants, flush with Nitrogen gas, or vacuum packing.`,
      },
    ],
  },

  'science-4': {
    title: 'Life Processes',
    subject: 'Science',
    weight: 9,
    readTime: '9 mins',
    sections: [
      {
        heading: '1. Nutrition & Photosynthesis',
        content: `Life processes are fundamental activities performed by living organisms to maintain life.
- **Autotrophic Nutrition:** Green plants synthesize food using CO₂, H₂O, sunlight, and chlorophyll.
Overall Equation: 6CO₂ + 6H₂O → (Sunlight / Chlorophyll) → C₆H₁₂O₆ + 6O₂.
Steps: (1) Absorption of light energy by chlorophyll, (2) Conversion of light to chemical energy & splitting of water, (3) Reduction of CO₂ to carbohydrates.`,
        keyBox: {
          title: '🫀 Human Digestion & Respiration Highlights',
          items: [
            '**Stomach:** Secretes HCl (kills bacteria, acidic medium), Pepsin (digests proteins), Mucus (protects stomach lining).',
            '**Small Intestine:** Site of complete digestion. Bile juice (emulsifies fats), Pancreatic juice (Trypsin & Lipase). Villi absorb nutrients.',
            '**Respiration Types:** Aerobic (in Mitochondria, yields 38 ATP) vs Anaerobic (in Yeast yields Ethanol+CO₂; in muscle fatigue yields Lactic acid).',
          ],
        },
      },
      {
        heading: '2. Transportation & Excretion',
        content: `- **Double Circulation in Humans:** Blood passes through heart twice during one complete cycle (Pulmonary circuit + Systemic circuit). Prevents mixing of oxygenated and deoxygenated blood.
- **Excretion & Nephron:** Nephron is structural & functional unit of kidney. Performs Bowman's capsule filtration, selective reabsorption of glucose, amino acids, salts, and urine secretion.`,
      },
    ],
  },

  // ─── MATHEMATICS ──────────────────────────────────────────────────────────
  'math-1': {
    title: 'Real Numbers',
    subject: 'Mathematics',
    weight: 8,
    readTime: '7 mins',
    sections: [
      {
        heading: '1. Fundamental Theorem of Arithmetic',
        content: `Every composite number can be expressed (factorised) uniquely as a product of prime numbers, apart from the order in which the prime factors occur.`,
        keyBox: {
          title: '📐 Core Formulas & Properties',
          items: [
            '**HCF & LCM Relation:** For any two positive integers a and b: HCF(a, b) × LCM(a, b) = a × b.',
            '**HCF:** Product of smallest power of each common prime factor.',
            '**LCM:** Product of greatest power of each prime factor involved.',
          ],
        },
      },
      {
        heading: '2. Proof of Irrationality (Standard Board Proof)',
        content: `**To Prove:** √2 is irrational.
**Proof Method (Contradiction):**
Suppose √2 is rational. Let √2 = a / b, where a and b are co-prime integers (b ≠ 0).
Squaring both sides: 2 = a² / b² ⇒ a² = 2b².
Therefore, 2 divides a², which implies 2 divides a. Let a = 2c.
Substituting: (2c)² = 2b² ⇒ 4c² = 2b² ⇒ b² = 2c².
This implies 2 divides b² and thus 2 divides b.
Hence, 2 is a common factor of both a and b. This contradicts our assumption that a and b are co-prime!
Therefore, √2 is irrational. (Q.E.D.)`,
      },
    ],
  },

  'math-2': {
    title: 'Polynomials',
    subject: 'Mathematics',
    weight: 7,
    readTime: '6 mins',
    sections: [
      {
        heading: '1. Zeros of Quadratic Polynomials',
        content: `A quadratic polynomial is of standard form P(x) = ax² + bx + c (a ≠ 0).
Zeros are values of x for which P(x) = 0. Number of zeros equals degree of polynomial (at most 2 for quadratic).`,
        formulaBox: {
          title: 'Relationship Between Zeros and Coefficients',
          formula: 'Sum of Zeros (α + β) = -b / a  |  Product of Zeros (α × β) = c / a',
          subtext: 'Quadratic Polynomial with given zeros α and β: K[x² - (α + β)x + (α × β)]',
        },
      },
    ],
  },

  'math-3': {
    title: 'Pair of Linear Equations in Two Variables',
    subject: 'Mathematics',
    weight: 8,
    readTime: '8 mins',
    sections: [
      {
        heading: '1. Conditions for Consistency',
        content: `For system: a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0:`,
        keyBox: {
          title: '📊 Graphical & Algebraic Interpretation',
          items: [
            '**Intersecting Lines (Unique Solution):** a₁/a₂ ≠ b₁/b₂ (Consistent System).',
            '**Coincident Lines (Infinitely Many Solutions):** a₁/a₂ = b₁/b₂ = c₁/c₂ (Dependent & Consistent).',
            '**Parallel Lines (No Solution):** a₁/a₂ = b₁/b₂ ≠ c₁/c₂ (Inconsistent System).',
          ],
        },
      },
    ],
  },

  'math-4': {
    title: 'Quadratic Equations',
    subject: 'Mathematics',
    weight: 8,
    readTime: '8 mins',
    sections: [
      {
        heading: '1. Standard Form & Discriminant',
        content: `Standard Form: ax² + bx + c = 0 (a ≠ 0).
Discriminant (D) = b² - 4ac.`,
        formulaBox: {
          title: 'Quadratic Formula & Nature of Roots',
          formula: 'x = (-b ± √(b² - 4ac)) / (2a)',
          subtext: 'If D > 0: 2 Real & Distinct Roots | If D = 0: 2 Equal Real Roots (-b/2a) | If D < 0: No Real Roots.',
        },
      },
    ],
  },

  'math-5': {
    title: 'Arithmetic Progressions', subject: 'Mathematics', weight: 9, readTime: '8 mins',
    sections: [{ heading: 'Exam-ready formulas and method', content: `An arithmetic progression (AP) has a constant common difference d between consecutive terms. First term = a, nth term = aₙ, number of terms = n.`, formulaBox: { title: 'Nth term and sum', formula: 'aₙ = a + (n − 1)d  |  Sₙ = n/2 [2a + (n − 1)d] = n/2(a + l)', subtext: 'Always identify a, d, n and last term l before substituting. Check the answer by writing the first few terms.' }, keyBox: { title: 'Common traps', items: ['**Sign of d:** A decreasing AP has d < 0.', '**Last term:** l = a + (n − 1)d; do not use aₙ as n × a.', '**Word problems:** Convert the statement into a sequence before applying a formula.'] } }],
  },

  'math-6': {
    title: 'Triangles', subject: 'Mathematics', weight: 10, readTime: '9 mins',
    sections: [{ heading: 'Similarity, proportionality and Pythagoras', content: `Two triangles are similar when their corresponding angles are equal and corresponding sides are proportional. Use AA, SAS or SSS similarity criteria, then match corresponding vertices carefully.`, keyBox: { title: 'Theorems to prepare', items: ['**Basic Proportionality Theorem:** A line parallel to one side of a triangle divides the other two sides in the same ratio.', '**Converse of BPT:** If a line divides two sides in the same ratio, it is parallel to the third side.', '**Pythagoras theorem:** In a right triangle, (hypotenuse)² = (base)² + (perpendicular)².'] } }],
  },

  'math-7': {
    title: 'Coordinate Geometry', subject: 'Mathematics', weight: 7, readTime: '7 mins',
    sections: [{ heading: 'Distances, sections and areas', content: `Plot points using ordered pairs (x, y). Keep the order of coordinates unchanged and use directed signs in all calculations.`, formulaBox: { title: 'Core formulas', formula: 'Distance = √[(x₂−x₁)² + (y₂−y₁)²]  |  Section ratio m:n: ((mx₂ + nx₁)/(m+n), (my₂ + ny₁)/(m+n))  |  Area = ½|x₁(y₂−y₃)+x₂(y₃−y₁)+x₃(y₁−y₂)|', subtext: 'Area zero means the three points are collinear.' } }],
  },

  'math-8': {
    title: 'Introduction to Trigonometry', subject: 'Mathematics', weight: 8, readTime: '8 mins',
    sections: [{ heading: 'Ratios and identities', content: `For an acute angle θ in a right triangle, sin θ = perpendicular/hypotenuse, cos θ = base/hypotenuse and tan θ = perpendicular/base.`, formulaBox: { title: 'Identities and standard values', formula: 'sin²θ + cos²θ = 1  |  1 + tan²θ = sec²θ  |  1 + cot²θ = cosec²θ', subtext: 'Use a common denominator and replace 1 with sin²θ + cos²θ when proving identities.' }, keyBox: { title: 'Common traps', items: ['**Reciprocal ratios:** sec θ = 1/cos θ, cosec θ = 1/sin θ, cot θ = 1/tan θ.', '**Proofs:** Simplify one side only unless asked otherwise.', '**Table values:** Memorise values for 0°, 30°, 45°, 60° and 90°.'] } }],
  },

  'math-9': {
    title: 'Applications of Trigonometry', subject: 'Mathematics', weight: 7, readTime: '7 mins',
    sections: [{ heading: 'Heights and distances', content: `Draw a labelled right-triangle diagram first. The angle of elevation is measured upward from the horizontal; the angle of depression is measured downward from the observer's horizontal line.`, formulaBox: { title: 'Method', formula: 'Choose sin, cos or tan from the known sides; substitute the angle; solve for the unknown; attach the correct unit.', subtext: 'Use the same horizontal reference line for angles of elevation and depression.' } }],
  },

  'math-10': {
    title: 'Circles', subject: 'Mathematics', weight: 7, readTime: '7 mins',
    sections: [{ heading: 'Tangents and their properties', content: `A tangent touches a circle at exactly one point. The radius through the point of contact is perpendicular to the tangent. Tangents drawn from an external point to a circle are equal in length.`, keyBox: { title: 'Proof checklist', items: ['Name the point of contact clearly.', 'Join the centre to the point of contact.', 'Use RHS congruence when comparing two right triangles.', 'State the equality of corresponding sides only after congruence.'] } }],
  },

  'math-11': {
    title: 'Areas Related to Circles', subject: 'Mathematics', weight: 6, readTime: '7 mins',
    sections: [{ heading: 'Circumference, area and sectors', content: `Use π = 22/7 or 3.14 as directed. Convert all lengths to the same unit before calculating.`, formulaBox: { title: 'Circle formulas', formula: 'Circumference = 2πr  |  Area = πr²  |  Arc length = (θ/360°)·2πr  |  Sector area = (θ/360°)·πr²', subtext: 'For a segment, area = sector area − area of the corresponding triangle.' } }],
  },

  'math-12': {
    title: 'Surface Areas and Volumes', subject: 'Mathematics', weight: 8, readTime: '9 mins',
    sections: [{ heading: 'Solids and combined figures', content: `Identify the solid or combination of solids before choosing a formula. For a hollow or composite solid, add or subtract the relevant surfaces and volumes, and keep the units consistent.`, formulaBox: { title: 'High-use formulas', formula: 'Cylinder: CSA = 2πrh, V = πr²h  |  Cone: l = √(r²+h²), CSA = πrl, V = ⅓πr²h  |  Sphere: SA = 4πr², V = ⁴⁄₃πr³', subtext: 'Surface area uses square units; volume uses cubic units.' } }],
  },

  'math-13': {
    title: 'Statistics', subject: 'Mathematics', weight: 9, readTime: '8 mins',
    sections: [{ heading: 'Grouped data', content: `For grouped observations, first prepare class marks and cumulative frequencies. Check whether the table uses continuous or inclusive intervals before calculating.`, formulaBox: { title: 'Mean, median and mode', formula: 'Mean = Σfᵢxᵢ/Σfᵢ  |  Median = l + [(n/2 − cf)/f]h  |  Mode = l + [(f₁−f₀)/(2f₁−f₀−f₂)]h', subtext: 'Here l is the lower boundary, h class size, cf preceding cumulative frequency, and f values are the relevant frequencies.' } }],
  },

  'math-14': {
    title: 'Probability', subject: 'Mathematics', weight: 4, readTime: '6 mins',
    sections: [
      { heading: 'Classical probability and events', content: `For equally likely outcomes, P(E) = n(E) / n(S), where S is the sample space and E is the event. An elementary event has one outcome; a compound event has more than one. An impossible event has probability 0 and a sure event has probability 1.`, formulaBox: { title: 'Essential rules', formula: 'P(E) = n(E)/n(S)  |  P(not E) = 1 − P(E)  |  P(S) = 1  |  P(∅) = 0', subtext: 'Always list the sample space before counting, and simplify the final fraction.' }, keyBox: { title: 'Standard sample spaces', items: ['**n coins:** 2ⁿ outcomes; 3 coins give 8 outcomes.', '**n dice:** 6ⁿ ordered outcomes; 2 dice give 36 outcomes.', '**52-card deck:** 26 red, 26 black, 12 face cards (J, Q, K); aces are not face cards.'] } },
      { heading: 'Worked board-style example', content: `Three fair coins are tossed together. Find the probability of getting at least two heads.\n\nSample space has 2³ = 8 equally likely outcomes. Favourable outcomes are HHH, HHT, HTH and THH, so n(E) = 4. Therefore P(E) = 4/8 = 1/2.\n\nFor a two-dice question, remember that outcomes are ordered pairs: n(S) = 6 × 6 = 36. For example, a sum of 8 has (2,6), (3,5), (4,4), (5,3), (6,2), so its probability is 5/36.` },
      { heading: 'Board answer checklist', content: `Write the experiment, sample space S, total outcomes n(S), event E, favourable outcomes n(E), formula and simplified answer. For “at least” include the stated number and all larger values; for “at most” include the stated number and all smaller values. Keep probability in the range 0 ≤ P(E) ≤ 1.` },
    ],
  },

  // ─── ENGLISH ─────────────────────────────────────────────────────────────
  'english-1': {
    title: 'A Letter to God',
    subject: 'English',
    weight: 7,
    readTime: '6 mins',
    sections: [
      {
        heading: '1. Chapter Summary & Themes',
        content: `Written by G.L. Fuentes, this story highlights the unshakeable faith of a poor hardworking farmer, Lencho, in God.
- **The Loss:** Lencho's ripe cornfield was completely destroyed by a devastating hailstorm ("a plague of locusts would have left more than this").
- **The Letter:** Driven by total faith, Lencho wrote a letter addressed to God requesting 100 pesos to re-sow his field and sustain his family.
- **Postmaster's Gesture:** Moved by Lencho's faith, the kind postmaster collected money from colleagues and contributed part of his salary, sending 70 pesos signed as "God".
- **The Irony:** When Lencho received 70 pesos instead of 100, he did not doubt God. Instead, he wrote another letter asking God not to send the rest through mail because the post office employees were "a bunch of crooks".`,
        keyBox: {
          title: '📝 Core Board Themes & Character Traits',
          items: [
            '**Lencho:** Hardworking, simple-hearted, faithful, naive, resilient.',
            '**Postmaster:** Kind, generous, empathetic, compassionate human being.',
            '**Irony of Situation:** Lencho blames his benefactors (post office staff) thinking they stole 30 pesos.',
          ],
        },
      },
    ],
  },

  'english-2': {
    title: 'Nelson Mandela — Long Walk to Freedom',
    subject: 'English',
    weight: 7,
    readTime: '8 mins',
    sections: [
      {
        heading: '1. Historical Context & Key Quotations',
        content: `An extract from Nelson Mandela's autobiography documenting 10th May 1994 — the historic inauguration of South Africa's first democratic, non-racial government at Union Buildings amphitheatre in Pretoria.`,
        keyBox: {
          title: '✨ Essential Board Quotations & Concepts',
          items: [
            '**Meaning of Courage:** "Courage was not the absence of fear, but the triumph over it. The brave man is not he who does not feel afraid, but he who conquers that fear."',
            '**Twin Obligations:** Every man has two obligations: (1) To his family, parents, wife, and children, (2) To his people, community, and country.',
            '**Freedom Evolution:** Mandela realised his boyhood freedom was an illusion. True freedom means liberating both oppressed and oppressor.',
          ],
        },
      },
    ],
  },

  // ─── SOCIAL SCIENCE ──────────────────────────────────────────────────────
  'social-science-1': {
    title: 'The Rise of Nationalism in Europe',
    subject: 'Social Science',
    weight: 7,
    readTime: '8 mins',
    sections: [
      {
        heading: '1. French Revolution & The Nation-State',
        content: `The French Revolution (1789) was the first clear expression of nationalism. It introduced concepts of *La Patrie* (the fatherland) and *Le Citoyen* (the citizen), unified law system, and tricolour flag. Napoleonic Code (Civil Code of 1804) abolished feudal privileges, established equality before law, and secured property rights.`,
        keyBox: {
          title: '🌍 Major Unification Milestones',
          items: [
            '**Unification of Germany (1866–1871):** Architect: Otto von Bismarck using "Blood and Iron" policy. King William I proclaimed German Emperor at Versailles (Jan 1871).',
            '**Unification of Italy:** Key Figures: Giuseppe Mazzini (Young Italy), Count Cavour (Chief Minister), Giuseppe Garibaldi (Red Shirts), Victor Emmanuel II (King).',
            '**Allegories:** Germania (Germany - wearing oak leaf crown representing heroism), Marianne (France - representing liberty and republic).',
          ],
        },
      },
    ],
  },

  'social-science-2': {
    title: 'Nationalism in India',
    subject: 'Social Science',
    weight: 9,
    readTime: '10 mins',
    sections: [
      {
        heading: '1. Major Movements & Timeline',
        content: `Nationalism in India grew as part of the anti-colonial struggle led by Mahatma Gandhi.`,
        keyBox: {
          title: '📌 High-Yield Board Timeline (Must Remember)',
          items: [
            '**1915:** Mahatma Gandhi returned to India from South Africa.',
            '**1917–1918:** Champaran (Bihar), Kheda (Gujarat), Ahmedabad Mill Strike Satyagrahas.',
            '**13th April 1919:** Jallianwala Bagh Massacre in Amritsar under General Dyer.',
            '**1920–1922:** Non-Cooperation & Khilafat Movement. Withdrawn after Chauri Chaura violent incident (Feb 1922).',
            '**12 March 1930:** Dandi Salt March (340 km from Sabarmati to Dandi). Civil Disobedience Movement launched.',
            '**1932:** Poona Pact signed between Dr. B.R. Ambedkar and Mahatma Gandhi reserving seats for Depressed Classes.',
          ],
        },
      },
    ],
  },
}

export function getChapterNotes(chapterId) {
  return CHAPTER_NOTES[chapterId] || null
}
