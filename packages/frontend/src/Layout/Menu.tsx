import { useState } from 'react';
import { useConnectedUser } from '../connectedUserContext';
import { useNavigate } from 'react-router-dom';

export const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { username } = useConnectedUser();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      {isOpen && (
        <div className="bg-white shadow-lg rounded-md p-4">
          <p className="mb-2 text-lg text-palette-secondary font-semibold">
            Hello {username}!
          </p>
          <button
            className="flex items-center mb-2"
            onClick={() => {
              navigate('/');
            }}
          >
            <span className="mr-2">👀</span> All Questions
          </button>
          <button
            className="flex items-center mb-2"
            onClick={() => {
              navigate('/myQuestions');
            }}
          >
            <span className="mr-2">❓</span> My Questions
          </button>
          <button
            className="flex items-center mb-2"
            onClick={() => {
              navigate('/leaderboard');
            }}
          >
            <span className="mr-2">🏆</span> Leaderboard
          </button>
          <button
            className="flex items-center"
            onClick={() => {
              localStorage.removeItem('connectedUser');
              window.location.reload();
            }}
          >
            <span className="mr-2">❌</span> Disconnect
          </button>
        </div>
      )}
      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 bg-white rounded-full shadow-lg"
        >
          🏉
        </button>
      </div>
    </div>
  );
};
