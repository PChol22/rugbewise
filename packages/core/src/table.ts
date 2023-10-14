import { Table as DdbTable } from 'dynamodb-toolbox';
import { GSI1, GSI1_PK, GSI1_SK, PK, SK } from '../../../constants';
import { Table } from 'sst/node/table';
import { DynamoDbSingleTableEventStorageAdapter } from '@castore/dynamodb-event-storage-adapter';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dynamoDbClient = new DynamoDBClient({});
//const DocumentClient = DynamoDBDocumentClient.from(dynamoDbClient);

/*export const table = new DdbTable({
  name: Table.table.tableName,
  partitionKey: PK,
  sortKey: SK,
  DocumentClient,
  indexes: {
    [GSI1]: {
      partitionKey: GSI1_PK,
      sortKey: GSI1_SK,
    },
  },
});*/

export const eventsStorageAdapter = new DynamoDbSingleTableEventStorageAdapter({
  tableName: Table.eventsTable.tableName,
  dynamoDbClient,
});
