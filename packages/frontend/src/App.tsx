import { useEffect, useState } from 'react';

export const App = () => {
  const [users, setUsers] = useState<{ username: string; SK: string }[]>([]);
  const [username, setUsername] = useState('');

  const createUser = async () => {
    await fetch(import.meta.env.VITE_APP_API_URL + '/users', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
    setUsername('');
    await fetchUsers();
  };

  const fetchUsers = async () => {
    const response = await fetch(import.meta.env.VITE_APP_API_URL + '/users');
    const data = await response.json();
    setUsers(data);
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
      {users.map(user => (
        <div key={user.SK}>
          <p>{user.username}</p>
          <p>{user.SK}</p>
        </div>
      ))}
    </div>
  );
};
