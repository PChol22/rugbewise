import { ApiHandler } from 'sst/node/api';
import { LoginInput, LoginOutput } from '@rugbewise/contracts/login';
import { UserEntity, UserEntityName } from '@rugbewise/core/entities';
import { GSI1 } from '../../../constants';

export const login = ApiHandler(async _evt => {
  const { username } = JSON.parse(_evt.body as string) as LoginInput;

  const { Items: users = [] } = await UserEntity.query(UserEntityName, {
    eq: username,
    index: GSI1,
  });

  if (users.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'User not found' }),
    };
  }

  if (users.length > 1) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Multiple users found' }),
    };
  }

  const [user] = users;

  const response: LoginOutput = {
    userId: user.userId,
    email: user.email,
    username: user.username,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});
