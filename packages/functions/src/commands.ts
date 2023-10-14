import { randomUUID } from 'crypto';
import { ApiHandler } from 'sst/node/api';
import {
  answerQuestionCommand,
  createQuestionCommand,
  createUserCommand,
  downVoteAnswerCommand,
  upVoteAnswerCommand,
} from '@rugbewise/core/commands';
import { usersEventStore } from '@rugbewise/core/usersEventStore';

import {
  AnswerQuestionPathParameters,
  AnswerQuestionInput,
  AnswerQuestionOutput,
  CreateQuestionInput,
  CreateQuestionOutput,
  CreateUserInput,
  CreateUserOutput,
  DownVoteAnswerPathParameters,
  DownVoteAnswerInput,
  DownVoteAnswerOutput,
  UpVoteAnswerPathParameters,
  UpVoteAnswerInput,
  UpVoteAnswerOutput,
} from '@rugbewise/contracts/commands';
import { questionsEventStore } from '@rugbewise/core/questionsEventStore';

const generateUuid = () => randomUUID();

export const createUser = ApiHandler(async _evt => {
  const { username } = JSON.parse(_evt.body as string) as CreateUserInput;

  const { userId } = await createUserCommand.handler(
    { username },
    [usersEventStore],
    {
      generateUuid,
    },
  );

  const response: CreateUserOutput = {
    userId,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});

export const createQuestion = ApiHandler(async _evt => {
  const { userId, questionText } = JSON.parse(
    _evt.body as string,
  ) as CreateQuestionInput;

  const { questionId } = await createQuestionCommand.handler(
    { userId, questionText },
    [questionsEventStore, usersEventStore],
    {
      generateUuid,
    },
  );

  const response: CreateQuestionOutput = {
    questionId,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});

export const answerQuestion = ApiHandler(async _evt => {
  const { questionId } = _evt.pathParameters as AnswerQuestionPathParameters;
  const { userId, answerText } = JSON.parse(
    _evt.body as string,
  ) as AnswerQuestionInput;

  const { answerId } = await answerQuestionCommand.handler(
    { questionId, userId, answerText },
    [questionsEventStore, usersEventStore],
    {
      generateUuid,
    },
  );

  const response: AnswerQuestionOutput = {
    answerId,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});

export const upVoteAnswer = ApiHandler(async _evt => {
  const { questionId, answerId } =
    _evt.pathParameters as UpVoteAnswerPathParameters;
  const { userId } = JSON.parse(_evt.body as string) as UpVoteAnswerInput;

  await upVoteAnswerCommand.handler({ questionId, userId, answerId }, [
    questionsEventStore,
    usersEventStore,
  ]);

  const response: UpVoteAnswerOutput = {
    message: 'UpVote successful',
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});

export const downVoteAnswer = ApiHandler(async _evt => {
  const { questionId, answerId } =
    _evt.pathParameters as DownVoteAnswerPathParameters;
  const { userId } = JSON.parse(_evt.body as string) as DownVoteAnswerInput;

  await downVoteAnswerCommand.handler({ questionId, userId, answerId }, [
    questionsEventStore,
    usersEventStore,
  ]);

  const response: DownVoteAnswerOutput = {
    message: 'DownVote successful',
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});
