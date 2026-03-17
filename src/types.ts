export type Difficulty = 'basic' | 'intermediate' | 'advanced';

export interface MilitarySymbol {
  id: string;
  sidc: string;
  name: string;
  category: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
}

export interface QuizQuestion {
  id: string;
  type: 'symbol-to-name' | 'name-to-symbol';
  correctSymbol: MilitarySymbol;
  options: MilitarySymbol[];
}

export interface QuizResult {
  score: number;
  total: number;
  errors: {
    question: QuizQuestion;
    selectedId: string;
  }[];
  timestamp: number;
}
