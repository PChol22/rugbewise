import { QueryClient, QueryClientProvider } from 'react-query';
import { connectedUserContext, ConnectedUser } from './connectedUserContext';
import { Router } from './Router';
import { useMemo, useState } from 'react';

const queryClient = new QueryClient();

export const App = () => {
  const localStorageConnectedUser = useMemo(() => {
    const fromLocalStorage = localStorage.getItem('connectedUser');

    if (fromLocalStorage === null) return undefined;

    return JSON.parse(fromLocalStorage) as ConnectedUser;
  }, []);

  const [connectedUser, setConnectedUser] = useState<ConnectedUser | undefined>(
    localStorageConnectedUser,
  );

  return (
    <connectedUserContext.Provider value={{ connectedUser, setConnectedUser }}>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </connectedUserContext.Provider>
  );
};
