import {
  Aggregate,
  EventTypesDetails,
  EventStore,
  EventType,
  Reducer,
} from '@castore/core';
import { eventsStorageAdapter } from './eventsTable';
import { USERS_EVENT_STORE_ID } from '../../../constants';

export interface UserAggregate extends Aggregate {
  upVotedAnswers: string[];
  downVotedAnswers: string[];
  username: string;
}

const userCreatedEventType = new EventType<'UserCreated', { username: string }>(
  { type: 'UserCreated' },
);

const userUpVotedEventType = new EventType<'UserUpVoted', { answerId: string }>(
  { type: 'UserUpVoted' },
);

const userDownVotedEventType = new EventType<
  'UserDownVoted',
  { answerId: string }
>({ type: 'UserDownVoted' });

const userEvents = [
  userCreatedEventType,
  userUpVotedEventType,
  userDownVotedEventType,
];

export type EventsTypes = EventTypesDetails<typeof userEvents>;

const reduce: Reducer<UserAggregate, EventsTypes> = (aggregate, event) => {
  const { version, aggregateId } = event;

  switch (event.type) {
    case 'UserCreated': {
      const { username } = event.payload;
      return {
        aggregateId,
        version,
        upVotedAnswers: [],
        downVotedAnswers: [],
        username,
      };
    }
    case 'UserUpVoted': {
      const { answerId } = event.payload;
      return {
        ...aggregate,
        version,
        upVotedAnswers: [...aggregate.upVotedAnswers, answerId],
      };
    }
    case 'UserDownVoted': {
      const { answerId } = event.payload;
      return {
        ...aggregate,
        version,
        downVotedAnswers: [...aggregate.downVotedAnswers, answerId],
      };
    }
    default: {
      const type: never = event;
      throw new Error(`Unknown event type: ${type}`);
    }
  }
};

export const usersEventStore = new EventStore({
  eventStoreId: USERS_EVENT_STORE_ID,
  eventStoreEvents: userEvents,
  storageAdapter: eventsStorageAdapter,
  reduce,
});
