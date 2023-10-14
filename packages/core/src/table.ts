import { Table as DdbTable, Entity, EntityItem } from 'dynamodb-toolbox';
import { PK, SK } from '../../../constants';
import { Table } from 'sst/node/table';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dynamoDBClient = new DynamoDBClient({});
const DocumentClient = DynamoDBDocumentClient.from(dynamoDBClient);

const table = new DdbTable({
  name: Table.table.tableName,
  partitionKey: PK,
  sortKey: SK,
  DocumentClient,
});

export const UserEntityName = 'User';

export const UserEntity = new Entity({
  table,
  name: UserEntityName,
  attributes: {
    [PK]: { partitionKey: true, default: UserEntityName },
    [SK]: { sortKey: true },
    username: { type: 'string', required: true },
  },
});

export type UserEntityType = EntityItem<typeof UserEntity>;
