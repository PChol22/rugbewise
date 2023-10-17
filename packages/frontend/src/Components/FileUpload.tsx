import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface Props {
  file: File | null;
  setFile: (file: File | null) => void;
}

export const FileUpload = ({ file, setFile }: Props) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFile(acceptedFiles[0]);
    },
    [setFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
    },
    maxFiles: 1,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className="mb-4 border-2 border-dashed border-gray-400 rounded p-6 cursor-pointer hover:bg-gray-200 transition-colors duration-300 dropzone"
      >
        <input {...getInputProps()} />
        <div className="flex items-center justify-center space-x-3 text-gray-600">
          <span className="text-2xl" role="img" aria-label="rugby">
            📽️
          </span>
          {isDragActive ? (
            <p>Drop video here...</p>
          ) : (
            <p>Upload a video to help others decide</p>
          )}
        </div>
      </div>

      {file && <p className="mb-4">Selected video: {file.name}</p>}
    </div>
  );
};
