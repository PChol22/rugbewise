import { ListUsersOutput } from '@rugbewise/contracts/entities';
import { useQuery } from 'react-query';
import { Error, Loader } from '../Components';

export const getMedal = (index: number) => {
  switch (index) {
    case 0:
      return '🥇 ';
    case 1:
      return '🥈 ';
    case 2:
      return '🥉 ';
    default:
      return '';
  }
};

export const Leaderboard = () => {
  const { isLoading, isError, data } = useQuery('listUsers', async () => {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/users`);
    const { users } = (await response.json()) as ListUsersOutput;

    return users;
  });

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-center text-palette-primary">
        Leaderboard
      </h1>
      <div className="flex flex-col items-center justify-center w-full h-full space-y-6">
        {data?.map(({ userId, username, score }, index) => (
          <div
            key={userId}
            className="flex items-center justify-center w-full h-full gap-4"
          >
            <p className="text-2xl font-bold text-center text-palette-primary min-w-max">
              {getMedal(index)}
              {username}
            </p>
            <p className="text-2xl font-bold text-center text-palette-primary min-w-max">
              {score}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
