import {
  DownVoteAnswerInput,
  DownVoteAnswerOutput,
  UpVoteAnswerInput,
  UpVoteAnswerOutput,
} from '@rugbewise/contracts/commands';
import { useMutation, useQueryClient } from 'react-query';
import { useConnectedUser } from '../connectedUserContext';
import { GetQuestionOutput } from '@rugbewise/contracts/entities';

interface Props {
  answerId: string;
  username: string;
  answerText: string;
  questionId: string;
  upVotes: string[];
  downVotes: string[];
  createdAt: string;
}

export const Answer = ({
  username,
  answerText,
  upVotes,
  downVotes,
  answerId,
  questionId,
  createdAt,
}: Props) => {
  const { userId } = useConnectedUser();
  const queryClient = useQueryClient();

  const { mutate: performUpVote } = useMutation<
    UpVoteAnswerOutput,
    unknown,
    UpVoteAnswerInput
  >(
    async body => {
      const response = await fetch(
        `${
          import.meta.env.VITE_APP_API_URL
        }/questions/${questionId}/answers/${answerId}/upVote`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      );
      const { status } = response;

      if (status !== 200) throw new Error('Failed to upVote question');

      const data = (await response.json()) as UpVoteAnswerOutput;
      return data;
    },
    {
      onSuccess: async () => {
        await queryClient.cancelQueries({
          queryKey: ['questions', questionId],
        });
        const oldQuestion = queryClient.getQueryData<GetQuestionOutput>([
          'questions',
          questionId,
        ]);

        if (oldQuestion === undefined) return;

        const answer = oldQuestion.answers[answerId];

        queryClient.setQueryData<GetQuestionOutput>(['questions', questionId], {
          ...oldQuestion,
          answers: {
            ...oldQuestion.answers,
            [answerId]: {
              ...answer,
              upVotes: [...answer.upVotes, userId],
            },
          },
        });
      },
    },
  );

  const { mutate: performDownVote } = useMutation<
    DownVoteAnswerOutput,
    unknown,
    DownVoteAnswerInput
  >(
    async body => {
      const response = await fetch(
        `${
          import.meta.env.VITE_APP_API_URL
        }/questions/${questionId}/answers/${answerId}/downVote`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      );
      const { status } = response;

      if (status !== 200) throw new Error('Failed to downVote question');

      const data = (await response.json()) as DownVoteAnswerOutput;
      return data;
    },
    {
      onSuccess: async () => {
        await queryClient.cancelQueries({
          queryKey: ['questions', questionId],
        });
        const oldQuestion = queryClient.getQueryData<GetQuestionOutput>([
          'questions',
          questionId,
        ]);

        if (oldQuestion === undefined) return;

        const answer = oldQuestion.answers[answerId];

        queryClient.setQueryData<GetQuestionOutput>(['questions', questionId], {
          ...oldQuestion,
          answers: {
            ...oldQuestion.answers,
            [answerId]: {
              ...answer,
              downVotes: [...answer.downVotes, userId],
            },
          },
        });
      },
    },
  );

  return (
    <div className="flex flex-col w-300px h-max p-2 border-solid border-2 border-palette-primary rounded-md bg-white">
      <p className="text-sm text-gray-600 mb-2">
        <b>{username}</b> {new Date(createdAt).toLocaleString()}
      </p>
      <p className="text-md">{answerText}</p>
      <div className="self-end flex gap-1">
        <button
          className={`px-2 py-1 rounded-sm${
            upVotes.includes(userId) && ' bg-gray-200'
          } hover:bg-gray-200 hover:rounded-sm`}
          onClick={() => {
            performUpVote({ userId });
          }}
          disabled={upVotes.includes(userId)}
        >
          {upVotes.length}👍
        </button>
        <button
          className={`px-2 py-1 rounded-sm${
            downVotes.includes(userId) && ' bg-gray-200'
          } hover:bg-gray-200 hover:rounded-sm`}
          onClick={() => {
            performDownVote({ userId });
          }}
          disabled={downVotes.includes(userId)}
        >
          {downVotes.length} 👎
        </button>
      </div>
    </div>
  );
};
