import { Entity, EntityItem } from 'dynamodb-toolbox';
import { GSI1_PK, GSI1_SK, PK, SK } from '../../../constants';
import { table } from './table';

export const UserEntityName = 'User';

export const UserEntity = new Entity({
  table,
  name: UserEntityName,
  attributes: {
    [PK]: {
      partitionKey: true,
      default: UserEntityName,
      type: 'string',
      hidden: true,
    },
    [SK]: {
      sortKey: true,
      default: ({ userId }: { userId: string }) => userId,
      hidden: true,
    },
    username: { type: 'string', required: true },
    userId: { type: 'string', required: true },
    score: { type: 'number', default: 0 },
    email: { type: 'string' },
  },
});

export type UserEntityType = Omit<EntityItem<typeof UserEntity>, 'score'> & {
  score: number;
};

export const QuestionEntityName = 'Question';

export const QuestionEntity = new Entity({
  table,
  name: QuestionEntityName,
  attributes: {
    [PK]: {
      partitionKey: true,
      default: QuestionEntityName,
      type: 'string',
      hidden: true,
    },
    [SK]: {
      sortKey: true,
      default: ({ questionId }: { questionId: string }) => questionId,
      hidden: true,
    },
    [GSI1_PK]: {
      default: QuestionEntityName,
      type: 'string',
      hidden: true,
    },
    [GSI1_SK]: {
      default: ({ userId }: { userId: string }) => userId,
      type: 'string',
      hidden: true,
    },
    questionId: { type: 'string', required: true },
    userId: { type: 'string', required: true },
    questionText: { type: 'string', required: true },
    game: { type: 'map', required: true },
    gameTime: { type: 'string', required: true },
    filename: { type: 'string' },
    wasUserNotified: { type: 'boolean', default: false },
  },
});

export type QuestionEntityType = Omit<
  EntityItem<typeof QuestionEntity>,
  'game'
> & {
  game: {
    team1: string;
    team2: string;
    date: string;
  };
};

export const ResponseEntityName = 'Response';

export const ResponseEntity = new Entity({
  table,
  name: ResponseEntityName,
  attributes: {
    [PK]: {
      partitionKey: true,
      default: ResponseEntityName,
      type: 'string',
      hidden: true,
    },
    [SK]: {
      sortKey: true,
      default: ({ responseId }: { responseId: string }) => responseId,
      hidden: true,
    },
    [GSI1_PK]: {
      default: ResponseEntityName,
      type: 'string',
      hidden: true,
    },
    [GSI1_SK]: {
      default: ({ questionId }: { questionId: string }) => questionId,
      type: 'string',
      hidden: true,
    },
    questionId: { type: 'string', required: true },
    responseId: { type: 'string', required: true },
    userId: { type: 'string', required: true },
    responseText: { type: 'string', required: true },
    upVotes: { type: 'number', default: 0 },
    downVotes: { type: 'number', default: 0 },
  },
});

export type ResponseEntityType = Omit<
  EntityItem<typeof ResponseEntity>,
  'upVotes' | 'downVotes'
> & {
  upVotes: number;
  downVotes: number;
};
