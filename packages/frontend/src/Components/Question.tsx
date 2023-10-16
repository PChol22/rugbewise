interface Props {
  questionId: string;
  questionText: string;
  userId: string;
}

export const Question = ({ questionId, questionText, userId }: Props) => (
  <div
    key={questionId}
    className="flex flex-col w-300px h-max p-2 border-solid border-2 border-palette-secondary rounded-md bg-white mb-5"
  >
    <p className="text-sm text-gray-600 mb-2">{userId}</p>
    <p className="text-md">{questionText}</p>
  </div>
);
