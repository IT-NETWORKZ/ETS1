// Separate question bank for the full "Exam" page (candidate/exams/exam).
// Kept independent from src/data/questions.js (used by the Demo Exam) so the
// two experiences never share content.

export const EXAM_SUBJECTS = [
  { id: "quant", name: "Quantitative Aptitude" },
  { id: "verbal", name: "Verbal Ability" },
  { id: "reasoning", name: "Logical Reasoning" },
  { id: "general", name: "General Awareness" },
];

export const EXAM_QUESTION_BANK = {
  quant: [
    { q: "A car covers 240 km in 3 hours. What is its speed in m/s?", options: ["20 m/s", "22.2 m/s", "24 m/s", "18 m/s"], answer: 1 },
    { q: "Two numbers are in the ratio 4:7. If their sum is 121, find the larger number.", options: ["44", "70", "77", "84"], answer: 2 },
    { q: "An article costing ₹640 is sold at a loss of 12.5%. What is the selling price?", options: ["₹540", "₹550", "₹560", "₹580"], answer: 2 },
    { q: "Find the simple interest on ₹15,000 at 8% per annum for 3 years.", options: ["₹3,200", "₹3,400", "₹3,600", "₹3,800"], answer: 2 },
    { q: "What is the next term? 3, 9, 27, 81, ?", options: ["162", "216", "243", "324"], answer: 2 },
    { q: "A can finish a job in 10 days, B in 15 days. How long will they take together?", options: ["5 days", "6 days", "7 days", "8 days"], answer: 1 },
    { q: "What is 18% of 350?", options: ["61", "63", "65", "67"], answer: 1 },
    { q: "The average of 7 consecutive even numbers is 20. What is the largest number?", options: ["24", "26", "28", "30"], answer: 2 },
    { q: "A sum triples itself in 20 years at simple interest. Find the rate of interest per annum.", options: ["8%", "9%", "10%", "12%"], answer: 2 },
    { q: "If a : b = 2 : 3 and b : c = 4 : 5, find a : c.", options: ["4:15", "8:15", "2:5", "8:9"], answer: 1 },
    { q: "A trader marks goods 40% above cost and allows a 20% discount. Find his profit percentage.", options: ["10%", "12%", "14%", "16%"], answer: 1 },
    { q: "What is the least number that must be added to 1056 to make it divisible by 23?", options: ["2", "3", "4", "5"], answer: 1 },
  ],
  verbal: [
    { q: "Choose the correctly spelled word.", options: ["Occurence", "Occurrance", "Occurrence", "Ocurrence"], answer: 2 },
    { q: "Choose the synonym of 'Candid'.", options: ["Evasive", "Frank", "Reserved", "Secretive"], answer: 1 },
    { q: "Choose the antonym of 'Reluctant'.", options: ["Willing", "Hesitant", "Unwilling", "Doubtful"], answer: 0 },
    { q: "Fill in the blank: He is allergic ___ peanuts.", options: ["to", "with", "for", "from"], answer: 0 },
    { q: "Identify the correctly punctuated sentence.", options: ["Wheres my book,\" she asked.", "\"Where's my book?\" she asked.", "\"Wheres my book\" she asked?", "Where's my book she asked."], answer: 1 },
    { q: "Choose the word that best completes: The evidence was ___ to convict him.", options: ["insufficient", "insufficiency", "insufficiently", "insufficing"], answer: 0 },
    { q: "Pick the correct passive voice: 'The chef is preparing dinner.'", options: ["Dinner is prepared by the chef.", "Dinner is being prepared by the chef.", "Dinner was being prepared by the chef.", "Dinner has being prepared."], answer: 1 },
    { q: "Choose the one-word substitute for 'One who cannot be corrected'.", options: ["Incorrigible", "Illegible", "Ineligible", "Inedible"], answer: 0 },
    { q: "Choose the correctly ordered sentence.", options: ["Seldom does he complain.", "Seldom he does complain.", "He seldom does complain.", "Does he seldom complain."], answer: 0 },
    { q: "Select the correct meaning of the idiom 'Once in a blue moon'.", options: ["Very frequently", "Very rarely", "During the night", "Unexpectedly"], answer: 1 },
    { q: "Choose the correct plural form of 'Analysis'.", options: ["Analysises", "Analyses", "Analysis's", "Analysis"], answer: 1 },
    { q: "Identify the sentence with correct subject-verb agreement.", options: ["Neither of the boys were late.", "Neither of the boys was late.", "Neither of the boys are late.", "Neither of the boy was late."], answer: 1 },
  ],
  reasoning: [
    { q: "Look at the series: 4, 9, 19, 39, 79, ? What comes next?", options: ["119", "149", "159", "169"], answer: 2 },
    { q: "If 'ROSE' is coded as 'SPTF', how is 'BIRD' coded using the same logic?", options: ["CJSE", "CKSF", "DJSF", "CJSF"], answer: 0 },
    { q: "Pointing to a man, a woman says, 'His mother is the only daughter of my mother.' How is the woman related to the man?", options: ["Sister", "Mother", "Aunt", "Grandmother"], answer: 1 },
    { q: "Find the odd one out.", options: ["Mercury", "Venus", "Sirius", "Mars"], answer: 2 },
    { q: "P is older than Q but younger than R. S is older than R. Who is the oldest?", options: ["P", "Q", "R", "S"], answer: 3 },
    { q: "Complete the analogy: Author : Book :: Composer : ?", options: ["Orchestra", "Symphony", "Piano", "Concert"], answer: 1 },
    { q: "If EAST becomes WEST in a code, what does NORTH become?", options: ["SOUTH", "MLIBGS", "SOUHT", "TROHN"], answer: 0 },
    { q: "In a certain code, 'CHAIR' is written as 'DIBJS'. How is 'TABLE' written in that code?", options: ["UBCMF", "SZAKD", "UBCLF", "UACMF"], answer: 0 },
    { q: "Which number replaces the question mark? 2, 5, 10, 17, 26, ?", options: ["35", "36", "37", "38"], answer: 2 },
    { q: "Statement: All squares are rectangles. All rectangles are quadrilaterals. Conclusion: All squares are quadrilaterals.", options: ["True", "False", "Cannot be determined", "None of the above"], answer: 0 },
    { q: "A clock shows 3:15. What is the angle between the hour and minute hands?", options: ["0°", "5.5°", "7.5°", "10°"], answer: 2 },
    { q: "Five friends sit in a row. A is left of B but right of C. D is right of B. E is at one end. Who is in the middle?", options: ["A", "B", "C", "D"], answer: 0 },
  ],
  general: [
    { q: "Which is the largest ocean on Earth?", options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], answer: 2 },
    { q: "The headquarters of the United Nations is located in which city?", options: ["Geneva", "New York", "Paris", "The Hague"], answer: 1 },
    { q: "Who is regarded as the father of the Indian Constitution?", options: ["Mahatma Gandhi", "Jawaharlal Nehru", "B. R. Ambedkar", "Sardar Patel"], answer: 2 },
    { q: "Which gas is most abundant in the Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"], answer: 2 },
    { q: "The Great Barrier Reef is located off the coast of which country?", options: ["Brazil", "Australia", "Indonesia", "South Africa"], answer: 1 },
    { q: "Which organ in the human body produces insulin?", options: ["Liver", "Kidney", "Pancreas", "Spleen"], answer: 2 },
    { q: "The currency of Japan is called:", options: ["Won", "Yuan", "Yen", "Ringgit"], answer: 2 },
    { q: "Mount Kilimanjaro is located in which continent?", options: ["Asia", "Africa", "South America", "Europe"], answer: 1 },
    { q: "Which is the smallest planet in our solar system?", options: ["Mars", "Mercury", "Venus", "Pluto"], answer: 1 },
    { q: "The Nobel Prize is awarded annually in a ceremony held mainly in which city?", options: ["Oslo", "Stockholm", "Geneva", "Copenhagen"], answer: 1 },
    { q: "Which Indian state is known as the 'Spice Garden of India'?", options: ["Karnataka", "Kerala", "Tamil Nadu", "Goa"], answer: 1 },
    { q: "The Great Wall of China was primarily built to defend against invasions from which direction?", options: ["South", "East", "North", "West"], answer: 2 },
  ],
};
