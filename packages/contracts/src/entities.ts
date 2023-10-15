export type ListQuestionsInput = {};
export type ListQuestionsOutput = {
  questions: {
    questionId: string;
    questionText: string;
    userId: string;
  }[];
};
