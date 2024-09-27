export interface Question {
  question: string;
  answer: string;
  points: number;
  completed: boolean;
}

export interface Category {
  name: string;
  questions: Question[];
}

export interface Team {
  name: string;
  score: number;
}