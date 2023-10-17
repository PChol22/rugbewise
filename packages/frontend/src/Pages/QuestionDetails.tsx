import { useParams } from 'react-router-dom';
import {
  Answer,
  Error as ErrorComponent,
  Loader,
  Question,
} from '../Components';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { GetQuestionOutput } from '@rugbewise/contracts/entities';
import { useState } from 'react';
import {
  AnswerQuestionInput,
  AnswerQuestionOutput,
} from '@rugbewise/contracts/commands';
import { useConnectedUser } from '../connectedUserContext';

export const QuestionDetails = () => {
  const { questionId } = useParams<{ questionId: string }>();

  if (questionId === undefined) throw new Error('questionId is undefined');

  const [answerText, setAnswerText] = useState('');
  const { userId, username } = useConnectedUser();
  const queryClient = useQueryClient();

  const {
    data: question,
    isLoading,
    isError,
  } = useQuery(
    ['questions', questionId],
    async () => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/questions/${questionId}`,
      );
      const question = (await response.json()) as GetQuestionOutput;

      return question;
    },
    { staleTime: 1000 * 60 },
  );

  const { mutate } = useMutation<
    AnswerQuestionOutput,
    unknown,
    AnswerQuestionInput
  >(
    async body => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/questions/${questionId}/answers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      );
      const { status } = response;

      if (status !== 200) throw new Error('Failed to answer question');

      const data = (await response.json()) as AnswerQuestionOutput;

      return data;
    },
    {
      onSuccess: async ({ answerId }) => {
        await queryClient.cancelQueries({
          queryKey: ['questions', questionId],
        });
        const oldQuestion = queryClient.getQueryData<GetQuestionOutput>([
          'questions',
          questionId,
        ]);

        if (oldQuestion === undefined) return;

        queryClient.setQueryData<GetQuestionOutput>(['questions', questionId], {
          ...oldQuestion,
          answers: {
            [answerId]: {
              upVotes: [],
              downVotes: [],
              userId,
              answerText,
              username,
              createdAt: new Date().toISOString(),
            },
            ...oldQuestion.answers,
          },
        });
        setAnswerText('');
      },
    },
  );

  if (isError) return <ErrorComponent />;
  if (isLoading || question === undefined) return <Loader />;

  return (
    <div className="flex flex-col gap-2">
      <Question
        username={question.username}
        questionText={question.questionText}
        questionId={questionId}
        fileSignedUrl={question.signedUrl}
        createdAt={question.createdAt}
      />
      <div className="flex flex-col items-start mb-2">
        <label className="block mb-2 text-gray-700">Answer the question</label>
        <textarea
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="..."
          value={answerText}
          onChange={e => setAnswerText(e.target.value)}
        ></textarea>
        <button
          className="btn btn-primary bg-palette-secondary text-white mt-2 px-2 py-1 rounded-sm"
          onClick={() => {
            mutate({ answerText, userId });
          }}
        >
          Answer
        </button>
      </div>
      {Object.entries(question.answers).map(([answerId, answer]) => (
        <Answer
          answerId={answerId}
          questionId={questionId}
          answerText={answer.answerText}
          username={answer.username}
          upVotes={answer.upVotes}
          downVotes={answer.downVotes}
          key={answerId}
          createdAt={answer.createdAt}
        />
      ))}
    </div>
  );
};
