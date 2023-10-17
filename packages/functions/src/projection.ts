import {
  UsersProjectionEvent,
  QuestionsProjectionEvent,
} from '@rugbewise/core/messageBus';

import {
  PutQuestionForListEntityType,
  PutUserEntityType,
  QuestionForDetailsEntity,
  QuestionForListEntity,
  UserEntity,
  PutQuestionForDetailsEntityType,
} from '@rugbewise/core/entities';

export const usersProjection = async ({ detail }: UsersProjectionEvent) => {
  const {
    aggregateId: userId,
    username,
    upVotedAnswers,
    downVotedAnswers,
  } = detail.aggregate;

  await UserEntity.put<PutUserEntityType>({
    userId,
    username,
    score: upVotedAnswers.length - downVotedAnswers.length,
  });
};

export const questionsProjection = async ({
  detail,
}: QuestionsProjectionEvent) => {
  const {
    aggregateId: questionId,
    questionText,
    userId,
    answers,
    fileKey,
  } = detail.aggregate;

  await Promise.all([
    QuestionForListEntity.put<PutQuestionForListEntityType>({
      questionId,
      questionText,
      userId,
    }),
    QuestionForDetailsEntity.put<PutQuestionForDetailsEntityType>({
      questionId,
      questionText,
      userId,
      answers,
      fileKey,
    }),
  ]);
};
