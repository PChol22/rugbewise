import {
  CreateUserInput,
  CreateUserOutput,
} from '@rugbewise/contracts/commands';
import { createUserCommand } from '@rugbewise/core/commands';
import { UserEntity, UserEntityName } from '@rugbewise/core/entities';
import { usersEventStore } from '@rugbewise/core/usersEventStore';
import { ApiHandler } from 'sst/node/api';
import { GSI1 } from '../../../constants';
import { randomUUID } from 'crypto';

const generateUuid = () => randomUUID();

export const createUser = ApiHandler(async _evt => {
  const { username } = JSON.parse(_evt.body as string) as CreateUserInput;

  const { Items: users = [] } = await UserEntity.query(UserEntityName, {
    eq: username,
    index: GSI1,
  });

  // TODO: Do not use read-model to check if user exists
  if (users.length > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'User already exists' }),
    };
  }

  const { userId } = await createUserCommand.handler(
    { username },
    [usersEventStore],
    {
      generateUuid,
    },
  );

  const response: CreateUserOutput = {
    userId,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});
