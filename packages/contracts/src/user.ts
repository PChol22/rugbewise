export type CreateUserInput = {
  username: string;
};

export type CreateUserOutput = {
  message: string;
};

export type ListUsersInput = {};

export type ListUsersOutput = {
  users: {
    userId: string;
    username: string;
    score: number;
  }[];
};
