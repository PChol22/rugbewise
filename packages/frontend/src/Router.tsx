import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { Home, Leaderboard, Login } from './Pages';
import { useContext } from 'react';
import { connectedUserContext } from './connectedUserContext';
import { Navigate, Outlet } from 'react-router-dom';

export const AuthenticationRequired = () => {
  const { connectedUser } = useContext(connectedUserContext);

  if (connectedUser === undefined) {
    return <Navigate to="login" />;
  }

  return <Outlet />;
};

export const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/login"
        element={
          <Layout displayMenu={false}>
            <Login />
          </Layout>
        }
      />
      <Route path="/" element={<AuthenticationRequired />}>
        <Route
          path="/leaderboard"
          element={
            <Layout>
              <Leaderboard />
            </Layout>
          }
        />
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
      </Route>
    </Routes>
  </BrowserRouter>
);
