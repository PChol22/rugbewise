import { createContext, useContext } from 'react';

export type ConnectedUser = {
  userId: string;
  username: string;
};

export const connectedUserContext = createContext<{
  connectedUser: ConnectedUser | undefined;
  setConnectedUser: (connectedUser: ConnectedUser | undefined) => void;
}>({
  connectedUser: undefined,
  setConnectedUser: () => {},
});

export const useConnectedUser = (): { userId: string; username: string } => {
  const { connectedUser } = useContext(connectedUserContext);

  if (connectedUser === undefined) {
    throw new Error(
      'useConnectedUser must be used within a ConnectedUserContext',
    );
  }

  return connectedUser;
};
