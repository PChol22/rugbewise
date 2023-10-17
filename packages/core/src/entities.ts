import { Entity, EntityItem } from 'dynamodb-toolbox';
import { GSI1_PK, GSI1_SK, PK, SK } from '../../../constants';
import { table } from './projectionsTable';

type PutItemEntityType<T extends EntityItem<Entity>> = Omit<
  T,
  'created' | 'modified' | 'entity'
>;

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
    [GSI1_PK]: {
      default: UserEntityName,
      type: 'string',
      hidden: true,
    },
    [GSI1_SK]: {
      default: ({ username }: { username: string }) => username,
      hidden: true,
    },
    username: { type: 'string', required: true },
    userId: { type: 'string', required: true },
    score: { type: 'number', required: true },
    email: { type: 'string' },
  },
});

export type UserEntityType = EntityItem<typeof UserEntity>;
export type PutUserEntityType = PutItemEntityType<UserEntityType>;

export const QuestionForListEntityName = 'QuestionForList';

export const QuestionForListEntity = new Entity({
  table,
  name: QuestionForListEntityName,
  attributes: {
    [PK]: {
      partitionKey: true,
      default: QuestionForListEntityName,
      type: 'string',
      hidden: true,
    },
    [SK]: {
      sortKey: true,
      default: ({
        questionId,
        userId,
      }: {
        questionId: string;
        userId: string;
      }) => `${userId}#${questionId}`,
      hidden: true,
    },
    questionId: { type: 'string', required: true },
    userId: { type: 'string', required: true },
    questionText: { type: 'string', required: true },
    // game: { type: 'map', required: true },
    // gameTime: { type: 'string', required: true },
    username: { type: 'string', required: true },
    createdAt: { type: 'string', required: true },
  },
});

export type QuestionForListEntityType = EntityItem<
  typeof QuestionForListEntity
>;
export type PutQuestionForListEntityType =
  PutItemEntityType<QuestionForListEntityType>;

export const QuestionForDetailsEntityName = 'QuestionForDetails';

export const QuestionForDetailsEntity = new Entity({
  table,
  name: QuestionForDetailsEntityName,
  attributes: {
    [PK]: {
      partitionKey: true,
      default: QuestionForDetailsEntityName,
      type: 'string',
      hidden: true,
    },
    [SK]: {
      sortKey: true,
      default: ({ questionId }: { questionId: string }) => questionId,
      hidden: true,
    },
    questionId: { type: 'string', required: true },
    userId: { type: 'string', required: true },
    questionText: { type: 'string', required: true },
    // game: { type: 'map', required: true },
    // gameTime: { type: 'string', required: true },
    answers: { type: 'map', required: true },
    fileKey: { type: 'string' },
    username: { type: 'string', required: true },
    createdAt: { type: 'string', required: true },
  },
});

export type QuestionForDetailsEntityType = Omit<
  EntityItem<typeof QuestionForDetailsEntity>,
  'answers'
> & {
  answers: {
    [answerId: string]: {
      userId: string;
      answerText: string;
      upVotes: string[];
      downVotes: string[];
      username: string;
      createdAt: string;
    };
  };
};
export type PutQuestionForDetailsEntityType =
  PutItemEntityType<QuestionForDetailsEntityType>;
