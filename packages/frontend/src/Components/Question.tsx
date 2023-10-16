import { useNavigate } from 'react-router-dom';

interface Props {
  questionId: string;
  questionText: string;
  userId: string;
}

export const Question = ({ questionId, questionText, userId }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      key={questionId}
      className="flex flex-col w-300px h-max p-2 border-solid border-2 border-palette-secondary rounded-md bg-white cursor-pointer hover:bg-gray-200"
      onClick={() => navigate(`/question/${questionId}`)}
    >
      <p className="text-sm text-gray-600 mb-2">{userId}</p>
      <p className="text-md">{questionText}</p>
    </div>
  );
};
