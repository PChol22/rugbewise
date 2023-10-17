import { Command, EventStore, tuple } from '@castore/core';
import { questionsEventStore } from './questionsEventStore';
import { usersEventStore } from './usersEventStore';

export const createQuestionCommand = new Command({
  commandId: 'CreateQuestion',
  requiredEventStores: tuple(questionsEventStore, usersEventStore),
  handler: async (
    commandInput: { questionText: string; userId: string; fileKey?: string },
    [questionsEventStore, usersEventStore],
    { generateUuid }: { generateUuid: () => string },
  ): Promise<{ questionId: string }> => {
    const { questionText, userId, fileKey } = commandInput;
    const questionId = generateUuid();

    const { aggregate: userAggregate } = await usersEventStore.getAggregate(
      userId,
    );

    if (userAggregate === undefined) {
      throw new Error(`User ${userId} does not exist`);
    }

    await questionsEventStore.pushEvent({
      aggregateId: questionId,
      version: 1,
      type: 'QuestionCreated',
      payload: { questionText, userId, fileKey },
    });

    return { questionId };
  },
});

export const answerQuestionCommand = new Command({
  commandId: 'AnswerQuestion',
  requiredEventStores: tuple(questionsEventStore, usersEventStore),
  handler: async (
    commandInput: {
      questionId: string;
      answerText: string;
      userId: string;
      answerId: string;
    },
    [questionsEventStore, usersEventStore],
  ): Promise<{ answerId: string }> => {
    const { questionId, answerText, userId, answerId } = commandInput;

    const [{ aggregate: questionAggregate }, { aggregate: userAggregate }] =
      await Promise.all([
        questionsEventStore.getAggregate(questionId),
        usersEventStore.getAggregate(userId),
      ]);

    if (questionAggregate === undefined) {
      throw new Error(`Question ${questionId} does not exist`);
    }

    if (userAggregate === undefined) {
      throw new Error(`User ${userId} does not exist`);
    }

    await questionsEventStore.pushEvent({
      aggregateId: questionId,
      version: questionAggregate.version + 1,
      type: 'QuestionAnswered',
      payload: { answerId, answerText, userId },
    });

    return { answerId };
  },
  eventAlreadyExistsRetries: 3,
});

export const createUserCommand = new Command({
  commandId: 'CreateUser',
  requiredEventStores: tuple(usersEventStore),
  handler: async (
    commandInput: { username: string },
    [usersEventStore],
    { generateUuid }: { generateUuid: () => string },
  ): Promise<{ userId: string }> => {
    const { username } = commandInput;
    const userId = generateUuid();

    await usersEventStore.pushEvent({
      aggregateId: userId,
      version: 1,
      type: 'UserCreated',
      payload: { username },
    });

    return { userId };
  },
});

export const upVoteAnswerCommand = new Command({
  commandId: 'UpVoteAnswer',
  requiredEventStores: tuple(questionsEventStore, usersEventStore),
  handler: async (
    commandInput: { answerId: string; userId: string; questionId: string },
    [questionsEventStore, usersEventStore],
  ): Promise<{ answerId: string }> => {
    const { answerId, userId, questionId } = commandInput;

    const [{ aggregate: questionAggregate }, { aggregate: userAggregate }] =
      await Promise.all([
        questionsEventStore.getAggregate(questionId),
        usersEventStore.getAggregate(userId),
      ]);

    if (questionAggregate === undefined) {
      throw new Error(`Question ${answerId} does not exist`);
    }

    if (userAggregate === undefined) {
      throw new Error(`User ${userId} does not exist`);
    }

    const answer = questionAggregate.answers[answerId];

    if (answer === undefined) {
      throw new Error(`Answer ${answerId} does not exist`);
    }

    const { aggregate: answerUserAggregate } =
      await usersEventStore.getAggregate(answer.userId);

    if (answerUserAggregate === undefined) {
      throw new Error(`User ${answer.userId} does not exist`);
    }

    if (answer.upVotes.includes(userId)) {
      throw new Error(`User ${userId} already upVotes answer ${answerId}`);
    }

    await EventStore.pushEventGroup(
      questionsEventStore.groupEvent({
        aggregateId: questionId,
        version: questionAggregate.version + 1,
        type: 'AnswerUpVoted',
        payload: { answerId, userId },
      }),
      usersEventStore.groupEvent({
        aggregateId: answerUserAggregate.aggregateId,
        version: answerUserAggregate.version + 1,
        type: 'UserUpVoted',
        payload: { answerId },
      }),
    );

    return { answerId };
  },
  eventAlreadyExistsRetries: 3,
});

export const downVoteAnswerCommand = new Command({
  commandId: 'DownVoteAnswer',
  requiredEventStores: tuple(questionsEventStore, usersEventStore),
  handler: async (
    commandInput: { answerId: string; userId: string; questionId: string },
    [questionsEventStore, usersEventStore],
  ): Promise<{ answerId: string }> => {
    const { answerId, userId, questionId } = commandInput;

    const [{ aggregate: questionAggregate }, { aggregate: userAggregate }] =
      await Promise.all([
        questionsEventStore.getAggregate(questionId),
        usersEventStore.getAggregate(userId),
      ]);

    if (questionAggregate === undefined) {
      throw new Error(`Question ${answerId} does not exist`);
    }

    if (userAggregate === undefined) {
      throw new Error(`User ${userId} does not exist`);
    }

    const answer = questionAggregate.answers[answerId];

    if (answer === undefined) {
      throw new Error(`Answer ${answerId} does not exist`);
    }

    const { aggregate: answerUserAggregate } =
      await usersEventStore.getAggregate(answer.userId);

    if (answerUserAggregate === undefined) {
      throw new Error(`User ${answer.userId} does not exist`);
    }

    if (answer.downVotes.includes(userId)) {
      throw new Error(`User ${userId} already downVotes answer ${answerId}`);
    }

    await EventStore.pushEventGroup(
      questionsEventStore.groupEvent({
        aggregateId: questionId,
        version: questionAggregate.version + 1,
        type: 'AnswerDownVoted',
        payload: { answerId, userId },
      }),
      usersEventStore.groupEvent({
        aggregateId: answerUserAggregate.aggregateId,
        version: answerUserAggregate.version + 1,
        type: 'UserDownVoted',
        payload: { answerId },
      }),
    );

    return { answerId };
  },
  eventAlreadyExistsRetries: 3,
});
