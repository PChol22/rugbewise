import { EventBridgeClient } from '@aws-sdk/client-eventbridge';

import {
  EventBridgeMessageBusAdapter,
  EventBridgeMessageBusMessage,
} from '@castore/event-bridge-message-bus-adapter';
import { EventBus } from 'sst/node/event-bus';

import { StateCarryingMessageBus } from '@castore/core';
import { usersEventStore } from './usersEventStore';
import { questionsEventStore } from './questionsEventStore';

const eventBridgeClient = new EventBridgeClient({});

const messageBusAdapter = new EventBridgeMessageBusAdapter({
  eventBusName: EventBus.eventBus.eventBusName,
  eventBridgeClient,
});

export const messageBus = new StateCarryingMessageBus({
  messageBusId: 'StateCarryingMessageBus',
  messageBusAdapter,
  sourceEventStores: [usersEventStore, questionsEventStore],
});

export type UsersProjectionEvent = EventBridgeMessageBusMessage<
  typeof messageBus,
  'Users'
>;

export type QuestionsProjectionEvent = EventBridgeMessageBusMessage<
  typeof messageBus,
  'Questions'
>;
