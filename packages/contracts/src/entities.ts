export type ListQuestionsInput = {};
export type ListQuestionsQueryParameters = {
  userId: string;
};
export type ListQuestionsOutput = {
  questions: {
    questionId: string;
    questionText: string;
    userId: string;
    username: string;
    createdAt: string;
    game: string;
  }[];
};

export type GetQuestionPathParameters = {
  questionId: string;
};
export type GetQuestionInput = {};
export type GetQuestionOutput = {
  questionId: string;
  questionText: string;
  userId: string;
  answers: {
    [answerId: string]: {
      answerText: string;
      userId: string;
      upVotes: string[];
      downVotes: string[];
      username: string;
      createdAt: string;
    };
  };
  signedUrl?: string;
  username: string;
  createdAt: string;
  game: string;
};

export type ListUsersInput = {};
export type ListUsersOutput = {
  users: {
    userId: string;
    username: string;
    score: number;
  }[];
};
