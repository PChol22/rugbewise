import { Table as DdbTable } from 'dynamodb-toolbox';
import { GSI1, GSI1_PK, GSI1_SK, PK, SK } from '../../../constants';
import { Table } from 'sst/node/table';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dynamoDBClient = new DynamoDBClient({});
const DocumentClient = DynamoDBDocumentClient.from(dynamoDBClient);

export const table = new DdbTable({
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
});
