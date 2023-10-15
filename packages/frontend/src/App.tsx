import { useEffect, useState } from 'react';
import { ListQuestionsOutput } from '@rugbewise/contracts/entities';

export const App = () => {
  const [questions, setQuestions] = useState<ListQuestionsOutput['questions']>(
    [],
  );

  const fetchQuestions = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_API_URL + '/questions',
    );
    const { questions } = (await response.json()) as ListQuestionsOutput;
    setQuestions(questions);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div>
      <h1>All questions</h1>
      {questions.map(({ questionId, questionText }) => (
        <div key={questionId}>
          <p>{questionText}</p>
        </div>
      ))}
    </div>
  );
};
