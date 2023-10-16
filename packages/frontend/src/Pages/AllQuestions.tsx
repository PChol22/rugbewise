import { useQuery } from 'react-query';
import { ListQuestionsOutput } from '@rugbewise/contracts/entities';
import { Error, Loader, Question } from '../Components';
import { useNavigate } from 'react-router-dom';

export const AllQuestions = () => {
  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery(
    'questions',
    async () => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/questions`,
      );
      const { questions } = (await response.json()) as ListQuestionsOutput;

      return questions;
    },
    { staleTime: 1000 * 60 },
  );
  const navigate = useNavigate();

  if (isError) return <Error />;
  if (isLoading || questions === undefined) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4 gap-12">
        <h1 className="text-3xl text-palette-primary">All Questions</h1>
        <button
          className="btn btn-primary bg-palette-secondary px-2 py-1 text-white rounded-sm"
          onClick={() => navigate('/newQuestion')}
        >
          Ask a question
        </button>
      </div>
      {questions.map(({ questionId, questionText, userId }) => (
        <Question
          key={questionId}
          questionId={questionId}
          questionText={questionText}
          userId={userId}
        />
      ))}
    </div>
  );
};
