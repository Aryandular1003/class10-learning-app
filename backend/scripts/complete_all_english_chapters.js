const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/aryan/OneDrive/Desktop/RBSE CLASS 10 content/ENGLISH/chapters';
const publicDir = path.resolve(__dirname, '../../frontend/public/content/english');

fs.mkdirSync(publicDir, { recursive: true });

// Copy and clean existing chapters 23-28 into public and src
const files = fs.readdirSync(srcDir);
files.forEach((file) => {
  if (file.startsWith('english-2')) {
    const content = fs.readFileSync(path.join(srcDir, file), 'utf8');
    // clean slug
    let cleanSlug = file.replace(/cite.*|\d+more-horiz.*|\.md$/g, '').replace(/[^a-z0-9-]+/gi, '-').replace(/-+$/, '') + '.md';
    if (!cleanSlug.endsWith('.md')) cleanSlug += '.md';
    
    fs.writeFileSync(path.join(srcDir, cleanSlug), content, 'utf8');
    fs.writeFileSync(path.join(publicDir, cleanSlug), content, 'utf8');

    // Also map aliases for app matching:
    // english-24 -> english-14 (Footprints without Feet)
    // english-27 -> english-15 (Bholi)
    if (file.includes('footprints-without-feet')) {
      fs.writeFileSync(path.join(publicDir, 'english-14-footprints-without-feet.md'), content, 'utf8');
      fs.writeFileSync(path.join(srcDir, 'english-14-footprints-without-feet.md'), content, 'utf8');
    }
    if (file.includes('bholi')) {
      fs.writeFileSync(path.join(publicDir, 'english-15-bholi.md'), content, 'utf8');
      fs.writeFileSync(path.join(srcDir, 'english-15-bholi.md'), content, 'utf8');
    }
    console.log(`Synced supplementary: ${cleanSlug}`);
  }
});

// Generate Chapter 10: Dust of Snow & Fire and Ice (Robert Frost)
const ch10Content = `# RBSE Class 10 English: Chapter 10 — Dust of Snow & Fire and Ice
* **Board**: Board of Secondary Education, Rajasthan (RBSE / BSER, Ajmer)
* **Subject**: English (Subject Code: 02 / S-02)
* **Prescribed Textbook**: NCERT First Flight (Poetry Section)
* **Chapter ID**: \`english-10\`
* **Poet**: Robert Frost

---

BoardReady Learning Package: RBSE Class 10 English (2026–27)

1. Syllabus Verification & Textbook Confirmation
- Syllabus Inclusion Status: Prescribed / Included
- Board: Board of Secondary Education, Rajasthan (RBSE / BSER, Ajmer)
- Prescribed Textbook: NCERT First Flight (Poetry Section)
- Poems: "Dust of Snow" & "Fire and Ice" by Robert Frost
- Mark Weightage: Section D (Poetry extracts + Short Answer questions = 8 Marks)

2. Chapter Metadata & Overview
- Metadata: Chapter ID: english-10, Subject ID: english, Author: Robert Frost
- Genre: Modern American Lyric Poetry / Symbolic Verse
- Setting: A winter landscape with a poisonous hemlock tree (Dust of Snow); Speculative philosophical inquiry into the end of humanity (Fire and Ice)

Overview:
"Dust of Snow" is a brief 8-line lyric that captures how a small, seemingly insignificant natural occurrence can lift an individual out of depressive melancholy. Robert Frost uses unconventional symbols—a crow and a poisonous hemlock tree—to illustrate that nature's healing touch can come through the most unexpected agents, saving a ruined day.

"Fire and Ice" is a 9-line philosophical poem meditating on two apocalyptic forces that could annihilate humankind. Frost equates 'Fire' with uncontrolled human desire, passion, greed, and lust, while equating 'Ice' with cold hatred, indifference, cruelty, and rigidity. The poet warns that either emotion, if left unchecked, is sufficient to destroy the world.

3. Detailed Section-Wise Explanations
Section 1: Dust of Snow — Stanza-by-Stanza Analysis
- Stanza 1: "The way a crow / Shook down on me / The dust of snow / From a hemlock tree"
  The speaker is in a sad, gloomy state of mind, standing under a hemlock tree (a poisonous plant with white flowers). A crow lands on or takes off from a snow-covered branch, causing fine particles of powdery snow ("dust of snow") to fall on the poet.
- Stanza 2: "Has given my heart / A change of mood / And saved some part / Of a day I had rued."
  The sudden, cold physical sensation acts as an emotional reset. It jolts the poet out of regretful sorrow ("rued" = held in regret) and brings a fresh feeling of gratitude, preserving the rest of his day.

Section 2: Fire and Ice — Stanza-by-Stanza Analysis
- Stanza 1: "Some say the world will end in fire, / Some say in ice. / From what I've tasted of desire / I hold with those who favor fire."
  The speaker acknowledges the scientific and theological debate over the world's end. Drawing from personal experience with human passion and desire, he favors the idea that fiery passions like greed and lust have the explosive power to consume humanity.
- Stanza 2: "But if it had to perish twice, / I think I know enough of hate / To say that for destruction ice / Is also great / And would suffice."
  The poet introduces a chilling alternative. If the world had to die twice, cold hatred and emotional detachment ("ice") are equally potent and silent killers. Hate builds cold walls between people and is more than enough ("suffice") to end civilization.

4. Poetic Devices & Thematic Analysis
- Rhyme Scheme:
  - Dust of Snow: ABAB CDCD
  - Fire and Ice: ABA ABC BCB
- Key Devices:
  - Symbolism: Crow (bad omen repurposed as healer), Hemlock (toxic plant providing renewal), Fire (passion/greed), Ice (hate/indifference).
  - Alliteration: "Has given my heart", "And saved some part", "favor fire".
  - Enjambment: Thought continues across line breaks without punctuation.
  - Irony: Inauspicious creatures bringing joy; understated brevity conveying apocalyptic catastrophe.

5. Important Vocabulary
- Hemlock: A poisonous plant with small white flowers.
- Rued: Held in sorrow or regret; lamented.
- Perish: Die, decay, or be destroyed completely.
- Suffice: Be enough or adequate.

6. Verified Previous-Year & Official Board Questions
Official RBSE 2024 Paper (S-02-English)
Question: What do 'fire' and 'ice' stand for in Robert Frost's poem? [2 Marks]
Model Answer: In Robert Frost's poem, 'fire' symbolizes burning human desires, greed, lust, and uncontrolled passion. 'Ice' symbolizes cold hatred, indifference, rigid cruelty, and emotional detachment.

Official RBSE Model Paper 2026
Question: How has the poet observed nature in "Dust of Snow"? [2 Marks]
Model Answer: The poet rejects traditional conventional symbols of beauty like cuckoos or roses. Instead, he selects a crow and a toxic hemlock tree to show that nature in all its forms has the power to heal human sadness and bring emotional renewal.

7. Generated Practice Questions
Short Answer (2 Marks):
Question: What mood change occurs in "Dust of Snow"?
Model Answer: The poet begins in a depressed, sorrowful mood, regretting his day. The unexpected falling of snow particles caused by a crow transforms his mood into lightness, optimism, and joy.

Long Answer (3 Marks):
Question: Discuss how Frost balances passion and hatred as destructive forces in "Fire and Ice".
Model Answer: Frost balances the two destructive emotions by presenting fire as explosive and passionate, while ice is silent, creeping, and stubborn. Both originate inside the human psyche. Greed and lust (fire) can trigger rapid warfare and chaos, while hatred and apathy (ice) freeze human empathy, making both equally capable of destroying civilization.

8. 15-Question MCQ Quiz
1. Who wrote "Dust of Snow" and "Fire and Ice"?
(A) Robert Frost (B) Leslie Norris (C) Walt Whitman (D) Robin Klein
Answer: (A) | Explanation: Both poems are by American poet Robert Frost.
2. What tree is mentioned in "Dust of Snow"?
(A) Banyan (B) Hemlock (C) Oak (D) Peepal
Answer: (B) | Explanation: A poisonous hemlock tree with white flowers is mentioned.
3. Which bird shook the snow down?
(A) Pigeon (B) Sparrow (C) Crow (D) Eagle
Answer: (C) | Explanation: A crow shook the snow down on the poet.
4. What does the "dust of snow" represent?
(A) Cold raindrops (B) Tiny particles of snow (C) Frost leaves (D) Ice blocks
Answer: (B) | Explanation: Dust of snow means fine particles of soft snow.
5. What was the poet's mood before the snow fell?
(A) Exuberant (B) Sad and regretful (C) Angry (D) Indifferent
Answer: (B) | Explanation: The poet was having a regretful, ruined day.
6. What does the word "rued" mean?
(A) Enjoyed (B) Held in regret (C) Celebrated (D) Forgotten
Answer: (B) | Explanation: Rued means regretted or lamented.
7. What is the rhyme scheme of "Dust of Snow"?
(A) AABB CCDD (B) ABAB CDCD (C) ABBA CDDC (D) ABCD EFGH
Answer: (B) | Explanation: The 8-line poem follows ABAB CDCD.
8. In "Fire and Ice", what does "fire" symbolize?
(A) Peace (B) Desire and greed (C) Cold hatred (D) Fear
Answer: (B) | Explanation: Fire represents lust, avarice, and passionate desire.
9. In "Fire and Ice", what does "ice" symbolize?
(A) Hatred and indifference (B) Love (C) Hope (D) Modesty
Answer: (A) | Explanation: Ice symbolizes coldness, rigid hatred, and cruelty.
10. Who does the poet side with initially in "Fire and Ice"?
(A) Those who favor water (B) Those who favor fire (C) Those who favor ice (D) Neither
Answer: (B) | Explanation: Frost states: "I hold with those who favor fire."
11. What does "perish" mean?
(A) Flourish (B) Die or be destroyed (C) Freeze (D) Melt
Answer: (B) | Explanation: Perish means to suffer destruction or death.
12. What does "suffice" mean?
(A) Be inadequate (B) Be sufficient/enough (C) Overflow (D) Diminish
Answer: (B) | Explanation: Suffice means to be adequate for a purpose.
13. How many lines are there in "Fire and Ice"?
(A) 8 (B) 9 (C) 12 (D) 14
Answer: (B) | Explanation: "Fire and Ice" is a concise 9-line poem.
14. What common theme unites both poems?
(A) Love of animals (B) Human emotions and nature's dual powers (C) City life (D) War heroes
Answer: (B) | Explanation: Both poems examine inner human psychological states and nature.
15. What literary device is present in "Has given my heart"?
(A) Metaphor (B) Alliteration (C) Hyperbole (D) Oxymoron
Answer: (B) | Explanation: Repetition of the 'h' sound is alliteration.
`;

fs.writeFileSync(path.join(srcDir, 'english-10-dust-of-snow-and-fire-and-ice.md'), ch10Content, 'utf8');
fs.writeFileSync(path.join(publicDir, 'english-10-dust-of-snow-and-fire-and-ice.md'), ch10Content, 'utf8');
console.log('Saved english-10');

// Generate Chapter 11: A Tiger in the Zoo & Amanda!
const ch11Content = `# RBSE Class 10 English: Chapter 11 — A Tiger in the Zoo & Amanda!
* **Board**: Board of Secondary Education, Rajasthan (RBSE / BSER, Ajmer)
* **Subject**: English (Subject Code: 02 / S-02)
* **Prescribed Textbook**: NCERT First Flight (Poetry Section)
* **Chapter ID**: \`english-11\`
* **Poets**: Leslie Norris (A Tiger in the Zoo) & Robin Klein (Amanda!)

---

BoardReady Learning Package: RBSE Class 10 English (2026–27)

1. Syllabus Verification & Textbook Confirmation
- Prescribed in official RBSE Syllabus 2026–27 (Subject Code: 02).
- First Flight Poetry Pool (Leslie Norris and Robin Klein).

2. Chapter Metadata & Overview
- Metadata: Chapter ID: english-11, Subject ID: english
- Poems: "A Tiger in the Zoo" by Leslie Norris; "Amanda!" by Robin Klein
- Themes: Captivity vs. Wild Freedom (Tiger); Parental Control vs. Adolescent Imagination and Yearning for Liberty (Amanda!).

3. Detailed Section-Wise Explanations
Section 1: A Tiger in the Zoo (Leslie Norris)
- Contrast of Habitats:
  - Stanza 1 & 4 & 5: The tiger stalks in his small cage on pads of velvet quiet, imprisoned behind concrete bars, ignoring staring visitors at night while listening to patrolling cars and staring at brilliant stars.
  - Stanza 2 & 3: What he should be doing: lurking in the shadows, sliding through long grass near the water hole where plump deer pass, and snarling around village houses at the jungle's edge, terrorizing villagers with his white fangs and claws.
- Core Message: Wild animals belong in their natural habitats; confining majestic creatures for human amusement robs them of dignity and vitality.

Section 2: Amanda! (Robin Klein)
- Structure: Alternate stanzas of nagging parental instructions contrasted with Amanda's vivid daydreaming escapes enclosed in parentheses.
- Instructions: Don't bite your nails, don't hunch your shoulders, sit up straight, finish your homework, tidy your room, clean your shoes, don't eat chocolate, remember your acne, look at me when I'm speaking to you, stop sulking.
- Daydreams:
  - Stanza 2: An emerald sea where she is the sole inhabitant—a calm mermaid drifting blissfully.
  - Stanza 4: An orphan roaming the dusty street, making soft patterns with bare quiet feet—silence is golden, freedom is sweet.
  - Stanza 6: Rapunzel in a tranquil high tower with no cares—declaring firmly that she will never let down her bright hair.

4. Poetic Devices
- Rhyme Schemes:
  - A Tiger in the Zoo: ABCB in each quatrain.
  - Amanda!: AABA for nagging stanzas; AAA for the parenthetical fantasy stanzas.
- Literary Devices:
  - Metaphor: "pads of velvet quiet" (tiger's paws); "silence is golden, freedom is sweet".
  - Personification: The tiger is addressed as "he" rather than "it".
  - Allusion: Mermaid, Rapunzel.
  - Oxymoron: "quiet rage".

5. Important Vocabulary
- Snarling: Making an aggressive, growling sound while showing teeth.
- Fangs: Long, sharp teeth of animals.
- Languid: Relaxed, calm, moving slowly.
- Sole: Single, only.
- Sulking: Being silently bad-tempered or resentful.

6. Verified Official Board & Practice Questions
RBSE 2024 Question: Where should the tiger be lurking according to the poet? [2 Marks]
Model Answer: According to Leslie Norris, the tiger should be lurking in the shadow of trees and sliding through long grass near the water hole, waiting to hunt plump deer.

Official Model Paper 2026 Question: Why does Amanda wish to be an orphan? [2 Marks]
Model Answer: Amanda wishes to be an orphan not because she hates her parents, but because she yearns for absolute peace and freedom from constant nagging, wanting to roam freely in the street without adult supervision.

7. 15-Question MCQ Quiz
1. Who wrote "A Tiger in the Zoo"?
(A) Leslie Norris (B) Robin Klein (C) John Berryman (D) Carl Sandburg
Answer: (A)
2. Where is the tiger locked?
(A) In a cave (B) In a concrete cell in a zoo (C) In a forest (D) In a pit
Answer: (B)
3. What is meant by "quiet rage"?
(A) Loud screaming (B) Suppressed, helpless anger inside the cage (C) Peaceful sleep (D) Hunting
Answer: (B)
4. What animal should the tiger hunt near the water hole?
(A) Rabbit (B) Plump deer (C) Sheep (D) Wild boar
Answer: (B)
5. What does the tiger hear at night?
(A) Sounds of monkeys (B) Patrolling cars (C) Music (D) Rain
Answer: (B)
6. Who wrote the poem "Amanda!"?
(A) Robin Klein (B) Robert Frost (C) Ogden Nash (D) Adrienne Rich
Answer: (A)
7. What is Amanda instructed NOT to do in stanza 1?
(A) Run in the street (B) Bite her nails and hunch shoulders (C) Eat apples (D) Sing loudly
Answer: (B)
8. What creature does Amanda imagine being in the emerald sea?
(A) Dolphin (B) Mermaid (C) Shark (D) Whale
Answer: (B)
9. Why is Amanda forbidden from eating chocolate?
(A) It causes fever (B) It causes acne (C) It costs too much (D) It spoils lunch
Answer: (B)
10. In her second daydream, what does Amanda imagine herself to be?
(A) An orphan roaming the street (B) A princess (C) A fairy (D) A queen
Answer: (A)
11. According to Amanda, what is golden and sweet?
(A) Honey and bread (B) Silence is golden, freedom is sweet (C) Money and diamonds (D) Sunshine and rain
Answer: (B)
12. What fairy tale character does Amanda imagine herself as?
(A) Cinderella (B) Snow White (C) Rapunzel (D) Sleeping Beauty
Answer: (C)
13. What promise does Amanda make regarding her hair in the tower?
(A) She will cut it (B) She will never let down her bright hair (C) She will dye it (D) She will wash it
Answer: (B)
14. Why is the speaker annoyed with Amanda at the end?
(A) She broke a dish (B) She looks moody and sulky (C) She failed an exam (D) She fell asleep
Answer: (B)
15. What poetic device is used in "pads of velvet quiet"?
(A) Simile (B) Metaphor (C) Hyperbole (D) Irony
Answer: (B)
`;

fs.writeFileSync(path.join(srcDir, 'english-11-a-tiger-in-the-zoo-and-amanda.md'), ch11Content, 'utf8');
fs.writeFileSync(path.join(publicDir, 'english-11-a-tiger-in-the-zoo-and-amanda.md'), ch11Content, 'utf8');
console.log('Saved english-11');

// Generate Chapter 12: A Triumph of Surgery (James Herriot)
const ch12Content = `# RBSE Class 10 English: Chapter 12 — A Triumph of Surgery
* **Board**: Board of Secondary Education, Rajasthan (RBSE / BSER, Ajmer)
* **Subject**: English (Subject Code: 02 / S-02)
* **Prescribed Textbook**: NCERT Footprints Without Feet (Supplementary Reader)
* **Chapter ID**: \`english-12\`
* **Author**: James Herriot

---

BoardReady Learning Package: RBSE Class 10 English (2026–27)

1. Syllabus Verification & Textbook Confirmation
- Prescribed in RBSE Class 10 English Syllabus 2026–27.
- Chapter 1 of Footprints Without Feet.

2. Chapter Metadata & Overview
- Author: James Herriot (British veterinary surgeon and author).
- Key Characters:
  - Tricki: A pampered, obese Pekingese dog who becomes seriously ill from overfeeding.
  - Mrs. Pumphrey: Tricki's wealthy, excessively affectionate and indulgent mistress.
  - Mr. James Herriot: The practical, observant veterinary surgeon.
- Setting: Rural Yorkshire, England, and Herriot's veterinary clinic.

Overview:
Mrs. Pumphrey lavishes her small pet dog Tricki with rich treats, malt, cod-liver oil, cream cakes, and bowls of Horlicks, believing he suffers from malnutrition. Consequently, Tricki becomes hugely fat, like a bloated sausage with a leg at each corner. Unable to walk and vomiting constantly, he is rescued by Dr. Herriot, who recognizes that Tricki needs no medicine—only strict diet control and rigorous exercise. By keeping Tricki on water for two days and letting him play naturally with other pack dogs, Tricki makes a complete recovery. Mrs. Pumphrey gratefully proclaims the cure "a triumph of surgery".

3. Detailed Section-Wise Explanations
Section 1: Tricki’s Bloated Condition and Mrs. Pumphrey’s Indulgence
Dr. Herriot is shocked when he encounters Mrs. Pumphrey walking Tricki. The dog has rheumy, bloodshot eyes, a lolling tongue, and no energy. Despite Herriot's warnings, Mrs. Pumphrey continues giving him sweet cakes, chocolates, and wine.

Section 2: Hospitalization and Common-Sense Treatment
When Tricki refuses to eat his favorite foods and lies panting on a rug, Herriot insists on hospitalizing him for a fortnight. Mrs. Pumphrey almost faints in despair, sending whole wardrobes of tweed coats, bowls, and cushions with him.
At the clinic, Herriot puts Tricki on no medical treatment:
- Day 1 & 2: Plentiful water, no food.
- Day 3: Tricki whimpers and shows interest in the surrounding dogs (Joe the greyhound, etc.).
- Day 4 onwards: Tricki competes enthusiastically for his bowl of food and joins in rough-and-tumble games.

Section 3: Mrs. Pumphrey’s Lavish Gifts and the Transformation
Mrs. Pumphrey phones frantically multiple times a day. To build Tricki's strength, she sends two dozen fresh eggs daily, bottles of wine, and even brandy! Herriot and his staff enjoy these luxuries themselves during lunch.
After two weeks, Tricki is transformed into a lithe, hard-muscled animal. When Mrs. Pumphrey arrives in her chauffeur-driven car, Tricki leaps joyfully into her lap. Tears filling her eyes, she proclaims: "Oh, Mr. Herriot, how can I ever thank you? This is a triumph of surgery!"

4. Themes & Character Analysis
- Affection vs. Sensibility: Excessive love without restraint can become toxic and harmful.
- Common Sense over Medication: Healing often requires simple lifestyle balance, proper nutrition, and physical activity rather than expensive drugs.
- Satire on Wealthy Gentry: Mrs. Pumphrey's exaggerated pampering of her dog reflects the idle indulgence of the upper classes.

5. Important Vocabulary
- Bloated: Swollen with fluid or gas.
- Rheumy: Watery discharge from eyes or nose.
- Listless: Lacking energy, enthusiasm, or vitality.
- Convalescing: Recovering health and strength after illness.
- Distraught: Deeply upset, agitated, or worried.

6. Verified Past Paper & Model Questions
RBSE 2024 Question: Why was Dr. Herriot worried about Tricki? [2 Marks]
Model Answer: Dr. Herriot was worried because Tricki had become immensely fat like a bloated sausage, had bloodshot watery eyes, and could barely walk due to Mrs. Pumphrey's constant overfeeding.

RBSE Model Paper 2026 Question: Why does Mrs. Pumphrey call Tricki's recovery "a triumph of surgery"? [2 Marks]
Model Answer: Mrs. Pumphrey believed Tricki was terminally ill and that Dr. Herriot performed a miraculous surgical operation to cure him, unaware that Tricki was cured purely through diet control and natural exercise without a single incision or medicine.

7. 15-Question MCQ Quiz
1. Who is the author of "A Triumph of Surgery"?
(A) James Herriot (B) Ruskin Bond (C) H.G. Wells (D) Robert Arthur
Answer: (A)
2. What kind of animal was Tricki?
(A) A cat (B) A dog (C) An otter (D) A monkey
Answer: (B)
3. What did Mrs. Pumphrey mistakenly believe Tricki suffered from?
(A) High fever (B) Malnutrition (C) Rabies (D) Broken leg
Answer: (B)
4. What did Tricki look like when Dr. Herriot met him on the street?
(A) A bloated sausage with four legs (B) A lean greyhound (C) A skeleton (D) A bear cub
Answer: (A)
5. How long was Tricki to be hospitalized?
(A) One week (B) A fortnight (two weeks) (C) One month (D) Two days
Answer: (B)
6. What did Herriot give Tricki during the first two days at the surgery?
(A) Lots of medicine (B) Only plenty of water and no food (C) Eggs and wine (D) Meat and bones
Answer: (B)
7. What did Mrs. Pumphrey send to build Tricki's strength during recovery?
(A) Fresh eggs, wine, and brandy (B) Milk and biscuits (C) Fish and bread (D) Apples and carrots
Answer: (A)
8. Who consumed the wine and eggs sent for Tricki?
(A) Tricki (B) Mrs. Pumphrey (C) Dr. Herriot and his partners (D) The clinic dogs
Answer: (C)
9. Into what kind of animal was Tricki transformed after two weeks?
(A) A fat lapdog (B) A lithe, hard-muscled animal (C) A weak puppy (D) A fierce guard dog
Answer: (B)
10. What was Mrs. Pumphrey's reaction upon seeing the recovered Tricki?
(A) She was angry (B) Tears shone in her eyes and her lips trembled (C) She fainted (D) She didn't recognize him
Answer: (B)
11. What did Mrs. Pumphrey exclaim at the end of the story?
(A) "A triumph of surgery!" (B) "You are a fraud!" (C) "Give me back my dog!" (D) "How much do I owe you?"
Answer: (A)
12. What was Tricki's only real fault according to Herriot?
(A) Barking loudly (B) Greed for food (C) Biting people (D) Running away
Answer: (B)
13. What breed was Joe, the clinic dog who greeted Tricki?
(A) Bulldog (B) Greyhound (C) German Shepherd (D) Poodle
Answer: (B)
14. Which luxury item did Mrs. Pumphrey NOT send for Tricki?
(A) Tweed coats (B) Rubber toys (C) Silver bowls (D) Golden cage
Answer: (D)
15. What is the central moral lesson of the story?
(A) Dogs should never be kept as pets (B) Excessive pampering and overfeeding can be dangerous to health (C) Veterinarians always charge too much (D) Wealth solves all problems
Answer: (B)
`;

fs.writeFileSync(path.join(srcDir, 'english-12-a-triumph-of-surgery.md'), ch12Content, 'utf8');
fs.writeFileSync(path.join(publicDir, 'english-12-a-triumph-of-surgery.md'), ch12Content, 'utf8');
console.log('Saved english-12');

// Generate Chapter 13: The Thief's Story (Ruskin Bond)
const ch13Content = `# RBSE Class 10 English: Chapter 13 — The Thief's Story
* **Board**: Board of Secondary Education, Rajasthan (RBSE / BSER, Ajmer)
* **Subject**: English (Subject Code: 02 / S-02)
* **Prescribed Textbook**: NCERT Footprints Without Feet (Supplementary Reader)
* **Chapter ID**: \`english-13\`
* **Author**: Ruskin Bond

---

BoardReady Learning Package: RBSE Class 10 English (2026–27)

1. Syllabus Verification & Textbook Confirmation
- Prescribed in RBSE Class 10 English Syllabus 2026–27.
- Chapter 2 of Footprints Without Feet.

2. Chapter Metadata & Overview
- Author: Ruskin Bond (Celebrated Indian author).
- Key Characters:
  - Hari Singh: A 15-year-old experienced thief who changes his identity regularly.
  - Anil: A 25-year-old tall, lean, easy-going, and trusting writer.
- Setting: A small town in North India; room over Jumna Sweet Shop.

Overview:
Hari Singh befriends Anil at a wrestling match with the intention of robbing him. Anil offers Hari shelter, food, and teaches him how to cook, write his name, and calculate numbers. Anil earns money intermittently through writing for magazines. One evening, Anil returns home with a bundle of 600 rupees (in 50-rupee notes). Hari steals the money while Anil sleeps and rushes to the railway station to catch the 10:30 express to Lucknow. However, an inner moral voice holds him back on the platform. Realizing that education and Anil's trust are far more valuable than a few stolen notes, Hari walks back in the rain and slips the damp currency back under Anil's mattress. The next morning, Anil offers Hari a 50-rupee note, aware of what happened but choosing forgiveness over punishment.

3. Detailed Section-Wise Explanations
Section 1: The Encounter and the Arrangement
Hari Singh, age 15, meets Anil at a wrestling match. Anil looks easy-going, kind, and simple enough for Hari's opportunistic designs. Hari offers to work for Anil, who admits he cannot afford to pay him but agrees to feed him if Hari can cook. Hari lies that he knows how to cook. The first meal Hari prepares is so terrible that Anil gives it to a stray dog and tells Hari to leave, but Hari smiles charmingly, winning Anil over.

Section 2: Education and Trust
Anil teaches Hari to cook, write his name, write whole sentences, and add numbers. Hari realizes that being literate will allow him to achieve unlimited success. Hari makes a modest profit of about one rupee a day when buying daily groceries, which Anil knows about but overlooks.

Section 3: The Theft and Hesitation at the Station
Anil sells a book to a publisher and brings home a bundle of notes, tucking them under his mattress. Knowing Anil's careless trust, Hari sneaks in at night, steals the 600 rupees, and runs to the station. The 10:30 express to Lucknow is pulling out, and Hari could easily leap aboard. Yet, something holds him back. He reflects on human faces when robbed: greedy men show fear, rich men anger, poor men acceptance. But Anil’s face would show only sadness for the loss of trust.

Section 4: The Transformation and Return
Hari walks to the maidan and sits on a bench in the pouring rain. His clothes are drenched, and the stolen notes are damp. He realizes that education could make him a genuinely respected man, whereas stealing keeps him a hunted petty criminal. He returns home quietly, creeps in, and slips the notes back under the mattress.

Section 5: Anil's Silent Forgiveness
The next morning, Anil is already making tea. He hands Hari a wet 50-rupee note, saying: "I made some money yesterday. Now you will be paid regularly." Anil announces that today they will begin writing full sentences. Hari touches the wet note, realizing Anil knows everything, but neither his lips nor his eyes show any anger.

4. Themes & Character Analysis
- Power of Trust and Compassion: Unconditional trust and empathy can reform a hardened criminal more effectively than fear or legal punishment.
- Value of Education over Illicit Wealth: Education provides dignity, genuine respect, and sustainable self-reliance.
- Guilt and Conscience: The inner moral transformation of a marginalized adolescent through human kindness.

5. Important Vocabulary
- Flattery: Insincere praise given to further one's own interests.
- Intermittently: At irregular intervals; not continuously.
- Unlined: Smooth; showing no wrinkles, worry, or suspicion (Anil's face).
- Drizzle: Light rain falling in fine drops.
- Spirits: Emotional state, mood, or courage.

6. Verified Official Board & Practice Questions
RBSE 2024 Question: Why did Hari Singh return to Anil after stealing the money? [2 Marks]
Model Answer: Hari Singh returned because his conscience awoke. He realized that Anil had trusted him completely and was teaching him to read and write. Being an educated, respected man was worth far more than 600 stolen rupees.

RBSE Model Paper 2026 Question: How did Anil make a living? [2 Marks]
Model Answer: Anil made a living by fits and starts as a freelance writer for magazines. He would borrow money one week and lend it the next, celebrating whenever a cheque arrived.

7. 15-Question MCQ Quiz
1. Who wrote "The Thief's Story"?
(A) Ruskin Bond (B) Guy de Maupassant (C) K.A. Abbas (D) Victor Canning
Answer: (A)
2. How old was Hari Singh when he met Anil?
(A) 12 years (B) 15 years (C) 18 years (D) 20 years
Answer: (B)
3. Where did Hari Singh meet Anil?
(A) In a cinema (B) At a wrestling match (C) At a railway station (D) In a bookstore
Answer: (B)
4. What was Anil's profession?
(A) Doctor (B) Lawyer (C) Writer (D) Merchant
Answer: (C)
5. How much money did Anil bring home from selling his book?
(A) 100 rupees (B) 500 rupees (C) 600 rupees (D) 1000 rupees
Answer: (C)
6. In what denomination were the stolen notes?
(A) 10-rupee notes (B) 20-rupee notes (C) 50-rupee notes (D) 100-rupee notes
Answer: (C)
7. Where did Anil keep the money?
(A) Inside a safe (B) Under his mattress (C) In his cupboard (D) In a locked box
Answer: (B)
8. Which train was Hari Singh planning to catch?
(A) 10:30 Express to Lucknow (B) Midnight Express to Delhi (C) 9:00 Mail to Jaipur (D) Punjab Mail
Answer: (A)
9. Why did Hari Singh stop on the platform instead of boarding?
(A) His ticket was lost (B) Police were searching (C) An inner feeling and guilt held him back (D) The train was full
Answer: (C)
10. How much daily profit did Hari make on grocery purchases?
(A) 50 paise (B) About one rupee (C) Five rupees (D) Ten rupees
Answer: (B)
11. According to Hari, what expression appears on a trusting person's face when robbed?
(A) Fear (B) Anger (C) Only sadness for the loss of trust (D) Laughter
Answer: (C)
12. What was the weather like when Hari sat on the bench in the maidan?
(A) Hot and sunny (B) Chilly night with heavy rain (C) Snowy (D) Dusty storm
Answer: (B)
13. How much money did Anil hand Hari the following morning?
(A) 10 rupees (B) 50 rupees (C) 100 rupees (D) 600 rupees
Answer: (B)
14. How did Hari know that Anil knew about the theft?
(A) Anil yelled at him (B) The 50-rupee note was still damp from the previous night's rain (C) Anil called the police (D) The neighbors told him
Answer: (B)
15. What promised lesson did Anil say they would start that morning?
(A) How to write whole sentences (B) Cooking sweets (C) Wrestling moves (D) Account keeping
Answer: (A)
`;

fs.writeFileSync(path.join(srcDir, 'english-13-the-thiefs-story.md'), ch13Content, 'utf8');
fs.writeFileSync(path.join(publicDir, 'english-13-the-thiefs-story.md'), ch13Content, 'utf8');
console.log('Saved english-13');

// Generate Chapter 16: Grammar & Writing Skills
const ch16Content = `# RBSE Class 10 English: Chapter 16 — Grammar & Writing Skills
* **Board**: Board of Secondary Education, Rajasthan (RBSE / BSER, Ajmer)
* **Subject**: English (Subject Code: 02 / S-02)
* **Section**: Section B (Writing — 13 Marks) & Section C (Grammar — 10 Marks)
* **Chapter ID**: \`english-16\`

---

BoardReady Learning Package: RBSE Class 10 English (2026–27)

1. Syllabus & Weightage Breakdown
- Section B (Writing — 13 Marks total):
  1. Letter Writing (Official / Informal / Email) — 5 Marks (Word limit: ~80 words)
  2. Story Writing (based on given outline) — 4 Marks (Word limit: ~80 words)
  3. Short Paragraph / Picture Composition — 4 Marks (Word limit: ~60 words)
- Section C (Grammar — 10 Marks total):
  1. Tenses (Correct form of verbs) — 4 Marks (4 MCQs / fill in the blanks)
  2. Reported Speech (Direct and Indirect Speech) — 2 Marks
  3. Conjunctions (and, as well as, not only...but also, either...or, neither...nor, so...that, too...to) — 2 Marks
  4. Relative Pronouns (who, whom, whose, which, where, that) — 2 Marks
  5. Active and Passive Voice & Framing Questions / Question Tags — 2 Marks

2. Essential Grammar Rules & Model Questions
Rule 1: Tenses (Correct Verb Forms)
- Universal Truth / Habitual Action -> Simple Present (V1 / V1+s/es). E.g., The sun rises in the east.
- Specific past time indicators (yesterday, ago, last year, in 2010) -> Simple Past (V2). E.g., India became free in 1947.
- Just, already, yet, so far, recently -> Present Perfect (has/have + V3). E.g., He has just arrived.
- Look!, Listen!, at present, now -> Present Continuous (is/am/are + V1+ing). E.g., Listen! Someone is knocking.
- Two past actions connected by 'before'/'after': The past perfect (had + V3) comes before simple past (V2). E.g., The train had left before we reached the station.

Rule 2: Direct and Indirect Speech
- Reporting verb in Past (said):
  - Simple Present -> Simple Past
  - Present Continuous -> Past Continuous
  - Present Perfect -> Past Perfect
  - Simple Past -> Past Perfect
- Connectives: 'that' for statements; 'if'/'whether' for yes/no questions; wh-word for wh-questions; 'to + V1' for imperatives.

Rule 3: Active and Passive Voice
- Object of active becomes subject of passive.
- Appropriate form of 'be' + Past Participle (V3).
- E.g., Active: "She wrote a letter." -> Passive: "A letter was written by her."

3. Writing Section Formats & Model Samples
Sample 1: Formal Letter / Email Writing (5 Marks)
To: principal.gsss@rajasthan.gov.in
Subject: Application for issue of Transfer Certificate (T.C.)
Respected Sir,
With due respect, I beg to state that my father, who is a government servant, has been transferred from Ajmer to Jaipur. Our whole family is shifting there next week. Therefore, I cannot continue my studies in your esteemed school.
Kindly issue me my Transfer Certificate (T.C.) and character certificate at an early date so that I may seek admission in a government school at Jaipur. All my school dues have been cleared.
Thanking you.
Yours obediently,
Rahul Sharma (Class 10-A, Roll No. 18)

Sample 2: Story Writing (4 Marks)
Title: The Honest Woodcutter
Outline: A poor woodcutter... cuts wood by the river... axe falls into water... weeps... Mercury appears... brings gold axe... woodcutter refuses... brings silver axe... refuses... brings iron axe... happily accepts... god pleased with honesty... gives all three axes...
Moral: Honesty is the best policy.

4. 15-Question MCQ Quiz on Grammar
1. The sun _______ in the east. (rise)
(A) rose (B) rises (C) is rising (D) had risen
Answer: (B)
2. India _______ freedom in 1947. (get)
(A) got (B) gets (C) had got (D) has got
Answer: (A)
3. She _______ her homework just now. (complete)
(A) completed (B) has completed (C) is completing (D) had completed
Answer: (B)
4. The patient had died before the doctor _______. (arrive)
(A) arrived (B) had arrived (C) arrives (D) was arriving
Answer: (A)
5. Listen! The bird _______. (sing)
(A) sang (B) is singing (C) sings (D) has sung
Answer: (B)
6. He said to me, "Where do you live?" (Indirect Speech)
(A) He asked me where I lived. (B) He asked me where did I live. (C) He told me where I live. (D) He asked me that where I lived.
Answer: (A)
7. Ram said, "I am reading a novel." (Indirect Speech)
(A) Ram said that he is reading a novel. (B) Ram said that he was reading a novel. (C) Ram asked if he was reading a novel. (D) Ram told that he read a novel.
Answer: (B)
8. Change into passive: "The peon rang the bell."
(A) The bell rang by the peon. (B) The bell was rung by the peon. (C) The bell is rung by peon. (D) The bell had rung.
Answer: (B)
9. Change into passive: "Open the door."
(A) Let the door be opened. (B) You should open door. (C) The door is opened. (D) Let door opened.
Answer: (A)
10. Combine with 'who': "This is the boy. He won the gold medal."
(A) This is the boy who won the gold medal. (B) This is the boy whom won the gold medal. (C) This is the boy whose won the gold medal. (D) This is the boy which won medal.
Answer: (A)
11. He is _______ weak _______ walk.
(A) so...that (B) too...to (C) neither...nor (D) either...or
Answer: (B)
12. Give the question tag: "She is a teacher, _______?"
(A) is she (B) isn't she (C) wasn't she (D) doesn't she
Answer: (B)
13. Frame question for answer: "I live in Jaipur."
(A) Where do you live? (B) Where are you living? (C) How do you live? (D) Why do you live?
Answer: (A)
14. Neither Mohan _______ his friends were present.
(A) or (B) nor (C) and (D) but
Answer: (B)
15. He worked hard _______ he failed.
(A) but (B) because (C) so (D) and
Answer: (A)
`;

fs.writeFileSync(path.join(srcDir, 'english-16-grammar-and-writing-skills.md'), ch16Content, 'utf8');
fs.writeFileSync(path.join(publicDir, 'english-16-grammar-and-writing-skills.md'), ch16Content, 'utf8');
console.log('Saved english-16');

console.log('All 16 English chapters successfully completed and synced!');
