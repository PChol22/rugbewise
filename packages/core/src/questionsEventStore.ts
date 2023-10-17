import {
  Aggregate,
  EventTypesDetails,
  EventStore,
  EventType,
  Reducer,
} from '@castore/core';
import { eventsStorageAdapter } from './eventsTable';

import { QUESTIONS_EVENT_STORE_ID } from '../../../constants';

export interface QuestionAggregate extends Aggregate {
  userId: string;
  questionText: string;
  answers: {
    [answerId: string]: {
      userId: string;
      answerText: string;
      upVotes: string[];
      downVotes: string[];
      username: string;
      createdAt: string;
    };
  };
  fileKey?: string;
  username: string;
  createdAt: string;
}

const questionCreatedEventType = new EventType<
  'QuestionCreated',
  {
    userId: string;
    questionText: string;
    fileKey?: string;
    username: string;
    createdAt: string;
  }
>({ type: 'QuestionCreated' });

const questionAnsweredEventType = new EventType<
  'QuestionAnswered',
  {
    userId: string;
    answerText: string;
    answerId: string;
    username: string;
    createdAt: string;
  }
>({ type: 'QuestionAnswered' });

const answerUpVotedEventType = new EventType<
  'AnswerUpVoted',
  { answerId: string; userId: string }
>({ type: 'AnswerUpVoted' });

const answerDownVotedEventType = new EventType<
  'AnswerDownVoted',
  { answerId: string; userId: string }
>({ type: 'AnswerDownVoted' });

export const questionEvents = [
  questionCreatedEventType,
  questionAnsweredEventType,
  answerUpVotedEventType,
  answerDownVotedEventType,
];

type EventsTypes = EventTypesDetails<typeof questionEvents>;

const reduce: Reducer<QuestionAggregate, EventsTypes> = (aggregate, event) => {
  const { version, aggregateId } = event;

  switch (event.type) {
    case 'QuestionCreated': {
      const { userId, questionText, fileKey, username, createdAt } =
        event.payload;
      return {
        aggregateId,
        version,
        userId,
        questionText,
        fileKey,
        answers: {},
        username,
        createdAt,
      };
    }
    case 'QuestionAnswered': {
      const { answerText, answerId, userId, username, createdAt } =
        event.payload;
      return {
        ...aggregate,
        version,
        answers: {
          ...aggregate.answers,
          [answerId]: {
            userId,
            answerText,
            upVotes: [],
            downVotes: [],
            username,
            createdAt,
          },
        },
      };
    }
    case 'AnswerUpVoted': {
      const { answerId, userId } = event.payload;
      const answer = aggregate.answers[answerId];
      return {
        ...aggregate,
        version,
        answers: {
          ...aggregate.answers,
          [answerId]: {
            ...answer,
            upVotes: [...answer.upVotes, userId],
          },
        },
      };
    }
    case 'AnswerDownVoted': {
      const { answerId, userId } = event.payload;
      const answer = aggregate.answers[answerId];
      return {
        ...aggregate,
        version,
        answers: {
          ...aggregate.answers,
          [answerId]: {
            ...answer,
            downVotes: [...answer.downVotes, userId],
          },
        },
      };
    }
    default: {
      const type: never = event;
      throw new Error(`Unknown event type: ${type}`);
    }
  }
};

export const questionsEventStore = new EventStore({
  eventStoreId: QUESTIONS_EVENT_STORE_ID,
  eventStoreEvents: questionEvents,
  storageAdapter: eventsStorageAdapter,
  reduce,
});
