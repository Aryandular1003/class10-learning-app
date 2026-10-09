// Verified syllabus content packs for RBSE Class 10
// Mathematics - Chapter 1: Real Numbers (वास्तविक संख्याएँ)
// Verified according to official RBSE Class 10 Mathematics syllabus (S-09) & NCERT.

export const RBSE_MATH_CH1_CONTENT = {
  chapter_id: 'math-1',
  subject_id: 'math',
  title: 'Real Numbers (वास्तविक संख्याएँ)',
  overview: {
    board: 'RBSE (Board of Secondary Education, Rajasthan, Ajmer)',
    class: 'Class 10',
    subject: 'Mathematics (गणित)',
    unit_name: 'Unit 1: Real Numbers (वास्तविक संख्याएँ)',
    chapter_name: 'Chapter 1: Real Numbers (वास्तविक संख्याएँ)',
    theory_marks_weightage: 4,
    total_theory_marks: 80,
    internal_sessional_marks: 20,
    grand_total: 100,
    prescribed_textbook: 'NCERT Mathematics Class 10',
    blueprint_breakdown: '4 Marks total: Typically 1 MCQ/VSA (1 Mark) + 1 Short Answer Question (3 Marks) OR 2 VSA (1 Mark each) + 1 Short Answer Question (2 Marks).',
    chapter_summary_hi: 'यह अध्याय अंकगणित की आधारभूत प्रमेय (Fundamental Theorem of Arithmetic), अभाज्य गुणनखंडन विधि द्वारा HCF तथा LCM ज्ञात करने, HCF(a,b) × LCM(a,b) = a × b के संबंध, तथा √2, √3, √5 एवं (a ± b√c) प्रकार की अपरिमेय संख्याओं की अपरिमेयता सिद्ध करने पर केंद्रित है।',
  },
  learning_objectives: [
    'अंकगणित की आधारभूत प्रमेय (Fundamental Theorem of Arithmetic) के कथन एवं अनुप्रयोग को समझना।',
    'किसी भी भाज्य संख्या को उसके अभाज्य गुणनखंडों के घातांक रूप के गुणनफल में व्यक्त करना।',
    'अभाज्य गुणनखंडन विधि द्वारा दो या तीन धनात्मक पूर्णांकों का HCF और LCM ज्ञात करना।',
    'दो धनात्मक पूर्णांकों a और b के लिए संबंध HCF(a,b) × LCM(a,b) = a × b को सत्यापित एवं लागू करना।',
    'विरोधाभास विधि (Method of Contradiction) द्वारा √2, √3, √5 तथा (a ± b√c) प्रकार की संख्याओं की अपरिमेयता सिद्ध करना।',
  ],
  concepts: [
    {
      concept_title: 'अंकगणित की आधारभूत प्रमेय (Fundamental Theorem of Arithmetic)',
      explanation: 'प्रत्येक भाज्य संख्या को अभाज्य संख्याओं के एक गुणनफल के रूप में व्यक्त (गुणनखंडित) किया जा सकता है, तथा यह गुणनखंडन अभाज्य गुणनखंडों के आने वाले क्रम के बिना अद्वितीय होता है।',
    },
    {
      concept_title: 'HCF और LCM की अभाज्य गुणनखंडन विधि',
      explanation: 'HCF संख्याओं में प्रत्येक उभयनिष्ठ (common) अभाज्य गुणनखंड की सबसे छोटी घात का गुणनफल होता है। LCM संख्याओं में सम्बद्ध प्रत्येक अभाज्य गुणनखंड की सबसे बड़ी घात का गुणनफल होता है।',
    },
    {
      concept_title: 'HCF और LCM का संबंध',
      explanation: 'किन्हीं दो धनात्मक पूर्णांकों a और b के लिए, HCF(a, b) × LCM(a, b) = a × b होता है। तीन या अधिक संख्याओं के लिए यह सामान्य सूत्र लागू नहीं होता; अर्थात HCF(a,b,c) × LCM(a,b,c) को सामान्यतः a × b × c के बराबर नहीं माना जा सकता।',
    },
    {
      concept_title: 'अपरिमेयता की उपपत्ति (Proof of Irrationality)',
      explanation: 'यदि p एक अभाज्य संख्या है और p, a^2 को विभाजित करता है, तो p, a को भी विभाजित करेगा। इसका उपयोग विरोधाभास द्वारा अपरिमेयता सिद्ध करने में किया जाता है।',
    },
  ],
  definitions: [
    {
      term_hi: 'प्राकृत संख्याएँ (Natural Numbers)',
      definition: 'गणना में प्रयुक्त होने वाली संख्याएँ {1, 2, 3, 4, ...} प्राकृत संख्याएँ कहलाती हैं।',
    },
    {
      term_hi: 'पूर्ण संख्याएँ (Whole Numbers)',
      definition: 'शून्य तथा प्राकृत संख्याओं का समुच्चय {0, 1, 2, 3, ...} पूर्ण संख्याएँ कहलाता है।',
    },
    {
      term_hi: 'पूर्णांक (Integers)',
      definition: 'ऋणात्मक, शून्य एवं धनात्मक संख्याओं का समुच्चय {..., -3, -2, -1, 0, 1, 2, 3, ...} पूर्णांक कहलाता है।',
    },
    {
      term_hi: 'परिमेय संख्याएँ (Rational Numbers)',
      definition: 'वे संख्याएँ जिन्हें p/q के रूप में लिखा जा सकता है, जहाँ p और q पूर्णांक हैं तथा q ≠ 0 होता है।',
    },
    {
      term_hi: 'अपरिमेय संख्याएँ (Irrational Numbers)',
      definition: 'वे वास्तविक संख्याएँ जिन्हें p/q के रूप में व्यक्त नहीं किया जा सकता, जहाँ p और q पूर्णांक हैं एवं q ≠ 0 है (जैसे √2, √3, π)।',
    },
    {
      term_hi: 'वास्तविक संख्याएँ (Real Numbers)',
      definition: 'सभी परिमेय और अपरिमेय संख्याओं के संग्रह को वास्तविक संख्याएँ (R) कहा जाता है।',
    },
    {
      term_hi: 'अभाज्य संख्याएँ (Prime Numbers)',
      definition: '1 से बड़ी वे प्राकृत संख्याएँ जो केवल 1 और स्वयं से ही विभाजित होती हैं (जैसे 2, 3, 5, 7, 11...)।',
    },
    {
      term_hi: 'भाज्य संख्याएँ (Composite Numbers)',
      definition: '1 से बड़ी वे प्राकृत संख्याएँ जो अभाज्य नहीं हैं तथा जिनके 1 और स्वयं के अलावा भी अन्य गुणनखंड होते हैं।',
    },
    {
      term_hi: 'सह-अभाज्य संख्याएँ (Co-prime Numbers)',
      definition: 'वे दो धनात्मक पूर्णांक a और b जिनका HCF(a, b) = 1 होता है।',
    },
  ],
  formulas: [
    {
      formula_name: 'HCF और LCM गुणनफल सूत्र',
      expression: 'HCF(a, b) × LCM(a, b) = a × b',
      description: 'केवल दो धनात्मक पूर्णांकों a और b के लिए सत्य।',
    },
    {
      formula_name: 'LCM ज्ञात करने का सूत्र',
      expression: 'LCM(a, b) = (a × b) / HCF(a, b)',
      description: 'यदि a, b और HCF ज्ञात हों।',
    },
    {
      formula_name: 'HCF ज्ञात करने का सूत्र',
      expression: 'HCF(a, b) = (a × b) / LCM(a, b)',
      description: 'यदि a, b और LCM ज्ञात हों।',
    },
  ],
  theorems_and_results: [
    {
      theorem_name: 'अंकगणित की आधारभूत प्रमेय (Theorem 1.1)',
      statement: 'प्रत्येक भाज्य संख्या को अभाज्य संख्याओं के एक गुणनफल के रूप में व्यक्त (गुणनखंडित) किया जा सकता है, तथा यह गुणनखंडन अभाज्य गुणनखंडों के आने वाले क्रम के बिना अद्वितीय होता है।',
    },
    {
      theorem_name: 'अभाज्य विभाजन प्रमेय (Theorem 1.2)',
      statement: 'मान लीजिए p एक अभाज्य संख्या है। यदि p, a^2 को विभाजित करता है, तो p, a को भी विभाजित करेगा, जहाँ a एक धनात्मक पूर्णांक है।',
    },
    {
      theorem_name: 'अपरिमेयता प्रमेय (Theorem 1.3)',
      statement: '√2, √3, √5 अपरिमेय संख्याएँ हैं।',
    },
  ],
  common_mistakes: [
    {
      error_title: 'तीन संख्याओं के लिए HCF × LCM = a × b × c लिखना',
      correction: 'HCF(a,b) × LCM(a,b) = a × b का सूत्र दो धनात्मक पूर्णांकों के लिए है। तीन संख्याओं के लिए कोई समान सामान्य सूत्र HCF × LCM = a × b × c नहीं है।',
    },
    {
      error_title: "अपरिमेयता की उपपत्ति में 'सह-अभाज्य' शब्द न लिखना",
      correction: "विरोधाभास विधि (Proof by Contradiction) में a और b को 'सह-अभाज्य (Co-prime)' लिखना अनिवार्य है, अन्यथा अंक कटते हैं।",
    },
    {
      error_title: 'HCF और LCM में घातों का भ्रम',
      correction: 'HCF में उभयनिष्ठ गुणनखंडों की न्यूनतम (smallest) घात ली जाती है, जबकि LCM में सभी अभाज्य गुणनखंडों की उच्चतम (greatest) घात ली जाती है।',
    },
  ],
  exam_tips: [
    'गुणनखंडन करते समय अभाज्य संख्याओं (2, 3, 5, 7, 11, 13...) के क्रम का ध्यान रखें और घातांकीय रूप (exponential form) में साफ लिखें।',
    'अपरिमेयता सिद्ध करने वाले प्रश्न में सभी चरण - मान लेना (Assumption), वर्ग करना, विभाजन दर्शाना और विरोधाभास लिखना स्पष्ट रूप से दर्शाएँ।',
    'उत्तर में इकाइयाँ (जैसे मिनट, मीटर) अवश्य लिखें जब केस-स्टडी या व्यावहारिक समस्या हल कर रहे हों।',
  ],
  quick_revision: [
    'अंकगणित की आधारभूत प्रमेय: भाज्य संख्या = अभाज्य गुणनखंडों का अद्वितीय गुणनफल।',
    'HCF = उभयनिष्ठ अभाज्य गुणनखंडों की न्यूनतम घातों का गुणनफल।',
    'LCM = सभी अभाज्य गुणनखंडों की उच्चतम घातों का गुणनफल।',
    'दो संख्याओं के लिए: HCF(a, b) × LCM(a, b) = a × b.',
    '√2, √3, √5 अपरिमेय संख्याएँ हैं।',
  ],
  one_hour_revision: [
    '1. 140, 156, 3825 का अभाज्य गुणनखंडन लिखकर दोहराएँ।',
    '2. HCF(a,b) × LCM(a,b) = a × b सूत्र पर 1 प्रश्न हल करें।',
    '3. √5 की अपरिमेयता सिद्ध करने का पूरा उत्तर लिखकर देखें।',
    '4. (3 + 2√5) रूप की अपरिमेयता सिद्ध करने का चरणबद्ध तरीका याद करें।',
  ],
}
