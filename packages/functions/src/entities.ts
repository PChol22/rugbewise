import {
  QuestionForDetailsEntity,
  QuestionForListEntity,
  QuestionForListEntityName,
  QuestionForDetailsEntityType,
  UserEntity,
  UserEntityName,
} from '@rugbewise/core/entities';
import { ApiHandler } from 'sst/node/api';
import {
  GetQuestionOutput,
  GetQuestionPathParameters,
  ListQuestionsOutput,
  ListUsersOutput,
} from '@rugbewise/contracts/entities';

export const listQuestions = ApiHandler(async () => {
  const { Items: questions = [] } = await QuestionForListEntity.query(
    QuestionForListEntityName,
  );

  const response: ListQuestionsOutput = {
    questions: questions.map(({ questionId, questionText, userId }) => ({
      questionId,
      questionText,
      userId,
    })),
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});

export const getQuestion = ApiHandler(async ({ pathParameters }) => {
  const { questionId } = pathParameters as GetQuestionPathParameters;

  const { Item: question } =
    await QuestionForDetailsEntity.get<QuestionForDetailsEntityType>({
      PK: QuestionForListEntityName,
      SK: questionId,
    });

  if (question === undefined) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: `Question ${questionId} not found`,
      }),
    };
  }

  const response: GetQuestionOutput = {
    questionId,
    questionText: question.questionText,
    userId: question.userId,
    answers: question.answers,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});

export const listUsers = ApiHandler(async () => {
  const { Items: users = [] } = await UserEntity.query(UserEntityName);

  const response: ListUsersOutput = {
    users: users.map(({ userId, username, score }) => ({
      userId,
      username,
      score,
    })),
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});
