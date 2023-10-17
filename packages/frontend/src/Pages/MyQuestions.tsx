import { useQuery } from 'react-query';
import { ListQuestionsOutput } from '@rugbewise/contracts/entities';
import { Error, Loader, Question } from '../Components';
import { useConnectedUser } from '../connectedUserContext';

export const MyQuestions = () => {
  const { userId } = useConnectedUser();
  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery(
    ['questions', userId],
    async () => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/questions?userId=${userId}`,
      );
      const { questions } = (await response.json()) as ListQuestionsOutput;
      return questions;
    },
    { staleTime: 1000 * 60 },
  );

  if (isError) return <Error />;
  if (isLoading || questions === undefined) return <Loader />;

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl text-palette-primary mb-4">My Questions</h1>
      {questions.map(
        ({ questionId, questionText, username, createdAt, game }) => (
          <Question
            key={questionId}
            questionId={questionId}
            questionText={questionText}
            username={username}
            createdAt={createdAt}
            game={game}
          />
        ),
      )}
    </div>
  );
};
