import { useQuery } from 'react-query';
import { useConnectedUser } from '../connectedUserContext';
import { ListQuestionsOutput } from '@rugbewise/contracts/entities';
import { Error, Loader } from '../Components';

export const Home = () => {
  const { userId, username } = useConnectedUser();

  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery('questions', async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/questions`,
    );
    const { questions } = (await response.json()) as ListQuestionsOutput;

    return questions;
  });

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  return (
    <div>
      <h1>Home</h1>
      <p>Connected user: {username}</p>
      <p>Connected user ID: {userId}</p>
      <p>Questions:</p>
      <ul>
        {questions?.map(({ questionId, questionText }) => (
          <li key={questionId}>{questionText}</li>
        ))}
      </ul>
    </div>
  );
};
