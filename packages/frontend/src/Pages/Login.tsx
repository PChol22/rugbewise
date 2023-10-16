import { useContext, useState } from 'react';
import { connectedUserContext } from '../connectedUserContext';
import { useMutation } from 'react-query';
import {
  CreateUserInput,
  CreateUserOutput,
} from '@rugbewise/contracts/commands';
import { useNavigate } from 'react-router-dom';
import { LoginInput, LoginOutput } from '@rugbewise/contracts/login';

const saveConnectedUser = (connectedUser: {
  userId: string;
  username: string;
}) => {
  localStorage.setItem('connectedUser', JSON.stringify(connectedUser));
};

export const Login = () => {
  const { setConnectedUser } = useContext(connectedUserContext);
  const navigate = useNavigate();
  const [loginUsername, setLoginUsername] = useState('');
  const [signInUsername, setSignInUsername] = useState('');
  const [signInEmail, setSignInEmail] = useState('');

  const { mutate: performSignIn } = useMutation<
    CreateUserOutput,
    unknown,
    CreateUserInput
  >(
    async body => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      );
      const { status } = response;

      if (status !== 200) throw new Error('Failed to create user');

      const data = (await response.json()) as CreateUserOutput;
      return data;
    },
    {
      onSuccess: ({ userId }) => {
        setConnectedUser({ userId, username: signInUsername });
        saveConnectedUser({ userId, username: signInUsername });
        navigate('/');
      },
      onError: () => {
        alert('Failed to create user, maybe it already exists');
      },
    },
  );

  const { mutate: performLogin } = useMutation<
    LoginOutput,
    unknown,
    LoginInput
  >(
    async body => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      );
      const { status } = response;

      if (status !== 200) throw new Error('Invalid credentials');

      const data = (await response.json()) as LoginOutput;
      return data;
    },
    {
      onSuccess: ({ userId, username }) => {
        setConnectedUser({ userId, username });
        saveConnectedUser({ userId, username });
        navigate('/');
      },
      onError: () => {
        alert('User does not exist');
      },
    },
  );

  return (
    <div className="flex flex-col justify-around gap-12">
      <div className="w-full">
        <h1 className="text-2xl">Sign in to RugBeWise</h1>
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-sm text-gray-500">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full p-2 border rounded"
              value={signInUsername}
              onChange={e => setSignInUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm text-gray-500">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border rounded"
              value={signInEmail}
              onChange={e => setSignInEmail(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <button
              className="btn btn-primary px-2 py-1 bg-palette-secondary rounded-sm text-white"
              onClick={() => {
                performSignIn({ username: signInUsername });
              }}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <h1 className="text-2xl">Already have an account? Log in</h1>
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-sm text-gray-500">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full p-2 border rounded"
              value={loginUsername}
              onChange={e => setLoginUsername(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <button
              className="btn btn-primary px-2 py-1 bg-palette-secondary rounded-sm text-white"
              onClick={() => performLogin({ username: loginUsername })}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
