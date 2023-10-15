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
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

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
import { SQSEvent } from 'aws-lambda';
import { Queue } from 'sst/node/queue';
import { UserEntity, UserEntityName } from '@rugbewise/core/entities';
import { GSI1 } from '../../../constants';

const generateUuid = () => randomUUID();
const sqsClient = new SQSClient({});

type QueueEvent =
  | {
      type: 'QuestionAnswered';
      payload: Parameters<typeof answerQuestionCommand.handler>[0];
    }
  | {
      type: 'AnswerUpVoted';
      payload: Parameters<typeof upVoteAnswerCommand.handler>[0];
    }
  | {
      type: 'AnswerDownVoted';
      payload: Parameters<typeof downVoteAnswerCommand.handler>[0];
    };

export const createUser = ApiHandler(async _evt => {
  const { username } = JSON.parse(_evt.body as string) as CreateUserInput;

  const { Items: users = [] } = await UserEntity.query(UserEntityName, {
    eq: username,
    index: GSI1,
  });

  // TODO: Do not use read-model to check if user exists
  if (users.length > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'User already exists' }),
    };
  }

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

  const queuePayload: QueueEvent = {
    type: 'QuestionAnswered',
    payload: {
      userId,
      answerText,
      questionId,
    },
  };

  await sqsClient.send(
    new SendMessageCommand({
      MessageGroupId: questionId,
      QueueUrl: Queue.editQuestionQueue.queueUrl,
      MessageBody: JSON.stringify(queuePayload),
      MessageDeduplicationId: generateUuid(),
    }),
  );

  const response: AnswerQuestionOutput = {
    message: 'Question answered',
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

  const queuePayload: QueueEvent = {
    type: 'AnswerUpVoted',
    payload: {
      userId,
      answerId,
      questionId,
    },
  };

  await sqsClient.send(
    new SendMessageCommand({
      MessageGroupId: questionId,
      QueueUrl: Queue.editQuestionQueue.queueUrl,
      MessageBody: JSON.stringify(queuePayload),
      MessageDeduplicationId: generateUuid(),
    }),
  );

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

  const queuePayload: QueueEvent = {
    type: 'AnswerDownVoted',
    payload: {
      userId,
      answerId,
      questionId,
    },
  };

  await sqsClient.send(
    new SendMessageCommand({
      MessageGroupId: questionId,
      QueueUrl: Queue.editQuestionQueue.queueUrl,
      MessageBody: JSON.stringify(queuePayload),
      MessageDeduplicationId: generateUuid(),
    }),
  );

  const response: DownVoteAnswerOutput = {
    message: 'DownVote successful',
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});

export const editQuestion = async (evt: SQSEvent) => {
  const { Records } = evt;

  await Promise.all(
    Records.map(async ({ body }) => {
      const parsedBody = JSON.parse(body) as QueueEvent;

      switch (parsedBody.type) {
        case 'QuestionAnswered': {
          return await answerQuestionCommand.handler(
            parsedBody.payload,
            [questionsEventStore, usersEventStore],
            {
              generateUuid,
            },
          );
        }
        case 'AnswerUpVoted': {
          return await upVoteAnswerCommand.handler(parsedBody.payload, [
            questionsEventStore,
            usersEventStore,
          ]);
        }
        case 'AnswerDownVoted': {
          return await downVoteAnswerCommand.handler(parsedBody.payload, [
            questionsEventStore,
            usersEventStore,
          ]);
        }
        default:
          const notExhaustive: never = parsedBody;
          throw new Error(`Unhandled event type: ${notExhaustive}`);
      }
    }),
  );
};
