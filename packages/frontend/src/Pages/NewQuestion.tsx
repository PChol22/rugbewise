import {
  CreateQuestionInput,
  CreateQuestionOutput,
} from '@rugbewise/contracts/commands';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useConnectedUser } from '../connectedUserContext';
import {
  GetQuestionOutput,
  ListQuestionsOutput,
} from '@rugbewise/contracts/entities';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '../Components';
import { GetUploadUrlOutput } from '@rugbewise/contracts/medias';

const GAMES = ['🇫🇷 vs 🇿🇦', '🏴󠁧󠁢󠁷󠁬󠁳󠁿 vs 🇦🇷', '🇳🇿 vs 🇮🇪', '🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs 🇫🇯'];

const getUploadUrl = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_APP_API_URL}/medias/upload-url`,
    {
      method: 'POST',
    },
  );
  const { uploadUrl, fileKey } = (await response.json()) as GetUploadUrlOutput;

  return { uploadUrl, fileKey };
};

const uploadVideoToS3 = async (file: File, uploadUrl: string) => {
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
};

export const NewQuestion = () => {
  const [questionText, setQuestionText] = useState('');
  const [game, setGame] = useState(GAMES[0]);
  const [file, setFile] = useState<File | null>(null);
  const { userId, username } = useConnectedUser();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate } = useMutation<
    CreateQuestionOutput,
    unknown,
    CreateQuestionInput
  >(
    async body => {
      let fileKey: string | undefined = undefined;

      if (file !== null) {
        const response = await getUploadUrl();
        await uploadVideoToS3(file, response.uploadUrl);
        fileKey = response.fileKey;
      }

      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/questions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...body,
            fileKey,
          }),
        },
      );
      const { status } = response;

      if (status !== 200) throw new Error('Failed to create question');

      const data = (await response.json()) as CreateQuestionOutput;

      return data;
    },
    {
      onSuccess: async ({ questionId, fileSignedUrl }) => {
        const newQuestion: ListQuestionsOutput['questions'][number] = {
          questionId,
          questionText,
          userId,
          username,
          createdAt: new Date().toISOString(),
          game,
        };

        await queryClient.cancelQueries({ queryKey: 'questions' });
        queryClient.setQueryData<ListQuestionsOutput['questions']>(
          'questions',
          old => [newQuestion, ...(old ?? [])],
        );
        await queryClient.cancelQueries({
          queryKey: ['questions', questionId],
        });
        queryClient.setQueryData<GetQuestionOutput>(['questions', questionId], {
          questionId,
          questionText,
          answers: {},
          userId,
          signedUrl: fileSignedUrl,
          username,
          createdAt: new Date().toISOString(),
          game,
        });

        navigate('/');
      },
    },
  );

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        className="p-8 bg-white shadow-md rounded-md"
        onSubmit={e => {
          mutate({ userId, questionText, game });
          e.preventDefault();
        }}
      >
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">
            What do you need to know?
          </label>
          <textarea
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="..."
            value={questionText}
            onChange={e => setQuestionText(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Match concerné</label>
          <select
            className="w-full p-2 border rounded"
            onChange={e => setGame(e.target.value)}
            value={game}
          >
            {GAMES.map(game => (
              <option value={game} key={game}>
                {game}
              </option>
            ))}
          </select>
        </div>
        <FileUpload file={file} setFile={setFile} />
        <button
          className="w-full py-2 bg-palette-secondary text-white rounded hover:bg-green-500"
          type="submit"
        >
          Ask question
        </button>
      </form>
    </div>
  );
};
