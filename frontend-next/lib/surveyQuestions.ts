export type SurveyQuestion = {
  prompt: string;
  type: 'input' | 'multiselect';
  input_type?: string;
  placeholder?: string | number;
  options?: string[];
};

export const surveyQuestions: SurveyQuestion[] = [
  { prompt: 'What is your name?', type: 'input', input_type: 'text', placeholder: 'Enter your full name here.' },
  { prompt: 'What gender do you identify with?', type: 'multiselect', options: ['Male', 'Female', 'Other'] },
  { prompt: 'How old are you?', type: 'input', input_type: 'number', placeholder: 18 },
  { prompt: 'What is your primary fitness goal?', type: 'multiselect', options: ['Improving my Health', 'Getting Leaner', 'Gaining Muscle', 'Gaining Strength', 'Athletic Performance', 'Become Competetion Ready'] },
  { prompt: 'In the past week, how many times have you worked out?', type: 'multiselect', options: ['None', '1-2 Days', '2-3 Days', '3-4 Days', '5+ days'] },
  { prompt: 'How often would you like to workout each week?', type: 'multiselect', options: ['1-2 Days', '2-3 Days', '3-4 Days', '5+ days'] },
  { prompt: 'What best describes your relationship with fitness?', type: 'multiselect', options: ['I am looking to compete in my sport of choice', 'I am just getting started', 'I want to get back into fitness', 'I am a beginner (3 months - 1 year of consistent exercise', 'I am an intermediate (1 - 3 years of consistent exercise', 'I am advanced (3+ years of structured and regimented exercise)'] },
  { prompt: 'Are there any special circumstances your coach should be aware of?', type: 'multiselect', options: ['A specific injury', 'Special nutritional requirements', 'A physical impairment', 'Pregnancy', 'None of the Above'] },
  { prompt: 'Where are you planning to exercise?', type: 'multiselect', options: ['Gym', 'Home', 'Fitness Studio', 'Outdoors', 'I am not sure yet.'] },
  { prompt: 'Have you worked with a coach/personal trainer before?', type: 'multiselect', options: ['Yes', 'No'] }
];

export const SURVEY_STORAGE_KEY = 'bastionSurveyAnswers';
