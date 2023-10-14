import { ApiHandler } from 'sst/node/api';
import { randomUUID } from 'crypto';
import { UserEntity, UserEntityType } from '@rugbewise/core/table';

export const createUser = ApiHandler(async _evt => {
  const { username } = JSON.parse(_evt.body as string) as { username?: string };

  if (username === undefined) {
    return {
      statusCode: 400,
      body: `Missing userName`,
    };
  }

  const userId = randomUUID();

  await UserEntity.put({
    SK: userId,
    username,
  });

  return {
    statusCode: 200,
    body: `User created with id ${userId}`,
  };
});

export const listUsers = ApiHandler(async _evt => {
  const { Items: users = [] } = await UserEntity.query<UserEntityType>('User', {
    limit: 10,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(users),
  };
});
