import { ImageParser } from '@castore/dynamodb-event-storage-adapter';
import { usersEventStore } from './usersEventStore';
import { questionsEventStore } from './questionsEventStore';

export const eventsStoreTableParser = new ImageParser({
  sourceEventStores: [usersEventStore, questionsEventStore],
});
