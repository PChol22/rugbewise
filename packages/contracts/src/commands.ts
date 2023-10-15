export type CreateUserInput = {
  username: string;
};

export type CreateUserOutput = {
  userId: string;
};

export type CreateQuestionInput = {
  userId: string;
  questionText: string;
};

export type CreateQuestionOutput = {
  questionId: string;
};

export type AnswerQuestionPathParameters = {
  questionId: string;
};

export type AnswerQuestionInput = {
  answerText: string;
  userId: string;
};

export type AnswerQuestionOutput = {
  message: string;
};

export type UpVoteAnswerPathParameters = {
  questionId: string;
  answerId: string;
};

export type UpVoteAnswerInput = {
  userId: string;
};

export type UpVoteAnswerOutput = {
  message: string;
};

export type DownVoteAnswerPathParameters = {
  questionId: string;
  answerId: string;
};

export type DownVoteAnswerInput = {
  userId: string;
};

export type DownVoteAnswerOutput = {
  message: string;
};
