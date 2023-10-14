import { eventsStoreTableParser } from '@rugbewise/core/imageParser';
import { DynamoDBStreamEvent } from 'aws-lambda';

import { messageBus } from '@rugbewise/core/messageBus';

export const handler = async ({ Records }: DynamoDBStreamEvent) => {
  await Promise.all(
    Records.map(async ({ dynamodb }) => {
      if (dynamodb?.NewImage === undefined) {
        return;
      }
      // @ts-expect-error AttributeValue types incompatible between @aws-sdk/client-dynamodb and aws-lambda
      const parsedImage = eventsStoreTableParser.parseImage(dynamodb.NewImage);

      await messageBus.getAggregateAndPublishMessage(parsedImage);
    }),
  );
};
