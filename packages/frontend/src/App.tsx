import { useEffect, useState } from 'react';
import { CreateUserInput, ListUsersOutput } from '@rugbewise/contracts/user';

export const App = () => {
  const [users, setUsers] = useState<{ username: string; userId: string }[]>(
    [],
  );
  const [username, setUsername] = useState('');

  const createUser = async () => {
    const body: CreateUserInput = {
      username,
    };
    await fetch(import.meta.env.VITE_APP_API_URL + '/users', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    setUsername('');
    await fetchUsers();
  };

  const fetchUsers = async () => {
    const response = await fetch(import.meta.env.VITE_APP_API_URL + '/users');
    const { users } = (await response.json()) as ListUsersOutput;
    setUsers(users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <button onClick={createUser}>Add User</button>
      {users.map(({ userId, username }) => (
        <div key={userId}>
          <p>{username}</p>
          <p>{userId}</p>
        </div>
      ))}
    </div>
  );
};
