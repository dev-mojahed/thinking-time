export const THINKING_PROMPTS = [
  "What is your biggest challenge today?",
  "What are two creative ideas to solve that challenge?",
  "What are you avoiding right now?",
  "What's one thing you're grateful for today?",
  "If you weren't afraid, what would you do next?",
  "What energizes you the most?",
  "What have you learned recently that you haven't applied yet?",
  "What's one question you'd ask your future self?",
  "What's one thing that made you smile this week?",
  "What problem keeps reappearing in your life? Why?",
  "What would you do if resources weren't a constraint?",
  "What small habit could make the biggest difference in your life?",
  "What are you most curious about right now?",
  "What would your ideal day look like?",
  "What's one belief you hold that might be limiting you?"
];

export const getRandomPrompt = (): string => {
  const randomIndex = Math.floor(Math.random() * THINKING_PROMPTS.length);
  return THINKING_PROMPTS[randomIndex];
};

export const INSPIRATIONAL_MESSAGES = [
  "Great minds think in silence. You've created space for wisdom to emerge.",
  "Every moment of reflection plants seeds for future growth.",
  "In stillness, you've found clarity. Carry this peace with you.",
  "Your thoughts have power. You've just strengthened that power.",
  "Reflection is the beginning of all great achievements.",
  "You've invested in your most valuable asset—your mind.",
  "Deep thinking creates lasting change. You're on the right path.",
  "Clarity comes to those who create space for it. Well done."
];

export const getRandomInspiration = (): string => {
  const randomIndex = Math.floor(Math.random() * INSPIRATIONAL_MESSAGES.length);
  return INSPIRATIONAL_MESSAGES[randomIndex];
};