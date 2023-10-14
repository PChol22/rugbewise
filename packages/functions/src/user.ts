import { ApiHandler } from 'sst/node/api';
import { randomUUID } from 'crypto';
import { UserEntity, UserEntityType } from '@rugbewise/core/entities';
import {
  CreateUserInput,
  CreateUserOutput,
  ListUsersOutput,
} from '@rugbewise/contracts/user';

export const createUser = ApiHandler(async _evt => {
  const { username } = JSON.parse(_evt.body as string) as CreateUserInput;

  if (username === undefined) {
    return {
      statusCode: 400,
      body: `Missing userName`,
    };
  }

  const userId = randomUUID();

  await UserEntity.put({
    username,
    userId,
  });

  const response: CreateUserOutput = {
    message: `User created with id ${userId}`,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});

export const listUsers = ApiHandler(async _evt => {
  const { Items: users = [] } = await UserEntity.query<UserEntityType>('User', {
    limit: 10,
  });

  const response: ListUsersOutput = {
    users: users.map(({ userId, username, score }) => ({
      userId,
      username,
      score,
    })),
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});
