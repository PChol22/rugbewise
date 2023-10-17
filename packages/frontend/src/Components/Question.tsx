import { useNavigate } from 'react-router-dom';

interface Props {
  questionId: string;
  questionText: string;
  username: string;
  fileSignedUrl?: string;
  createdAt: string;
  game: string;
}

export const Question = ({
  questionId,
  questionText,
  username,
  fileSignedUrl,
  createdAt,
  game,
}: Props) => {
  const navigate = useNavigate();

  return (
    <div
      key={questionId}
      className="flex flex-col w-300px h-max p-2 border-solid border-2 border-palette-secondary rounded-md bg-white cursor-pointer hover:bg-gray-200"
      onClick={() => navigate(`/question/${questionId}`)}
    >
      <div className="flex justify-between mb-2">
        <p className="text-sm text-gray-600">
          <b>{username}</b> {new Date(createdAt).toLocaleString()}
        </p>
        <p className="text-sm text-gray-600">{game}</p>
      </div>
      <p className="text-md">{questionText}</p>
      {fileSignedUrl && (
        <div className="mt-4">
          <h3 className="mb-2 text-sm text-gray-600">Video</h3>
          <div className="video-container border border-gray-300 rounded overflow-hidden shadow-lg">
            <video width="320" height="240" controls autoPlay loop muted>
              <source src={fileSignedUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
      {/* @ts-expect-error jsx tag not typed correctly */}
      <style jsx="true">
        {`
          .video-container {
            width: 100%;
            max-width: 320px;
            margin: 0 auto;
            box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            overflow: hidden;
          }
          video {
            display: block;
            width: 100%;
            height: auto;
          }
        `}
      </style>
    </div>
  );
};
