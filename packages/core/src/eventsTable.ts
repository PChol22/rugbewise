import { Table } from 'sst/node/table';
import { DynamoDbSingleTableEventStorageAdapter } from '@castore/dynamodb-event-storage-adapter';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const dynamoDbClient = new DynamoDBClient({});

export const eventsStorageAdapter = new DynamoDbSingleTableEventStorageAdapter({
  tableName: Table.eventsTable.tableName,
  dynamoDbClient,
});
