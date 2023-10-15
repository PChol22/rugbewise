import {
  QuestionForListEntity,
  QuestionForListEntityName,
} from '@rugbewise/core/entities';
import { ApiHandler } from 'sst/node/api';
import { ListQuestionsOutput } from '@rugbewise/contracts/entities';

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
