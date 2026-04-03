export type DifficultyLevel = "easy" | "medium" | "hard";
export type CorrectAnswerOption = "A" | "B" | "C" | "D";

export interface Question {
  id: number;
  subject: number;
  subject_name?: string | null;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: CorrectAnswerOption;
  marks: number;
  difficulty_level: DifficultyLevel;
  created_by: number;
  created_by_name?: string | null;
  created_at: string;
  updated_at: string;
}

export type QuestionListItem = Question;

export interface PaginatedQuestionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: QuestionListItem[];
}

export type QuestionsListResponse = PaginatedQuestionsResponse | QuestionListItem[];

export interface QuestionListParams {
  search?: string;
  subject?: number | "";
  difficulty_level?: DifficultyLevel | "";
  created_by?: number | "";
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface QuestionFormValues {
  subject: number | "";
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: CorrectAnswerOption;
  marks: number | string;
  difficulty_level: DifficultyLevel;
  created_by: number | "";
}

export interface SubjectOption {
  value: number;
  label: string;
}

export interface EmployeeOption {
  value: number;
  label: string;
}
