import {
  QuestionForDetailsEntity,
  QuestionForListEntity,
  QuestionForListEntityName,
  QuestionForDetailsEntityType,
  UserEntity,
  UserEntityName,
  QuestionForDetailsEntityName,
} from '@rugbewise/core/entities';
import { ApiHandler } from 'sst/node/api';
import {
  GetQuestionOutput,
  GetQuestionPathParameters,
  ListQuestionsOutput,
  ListUsersOutput,
} from '@rugbewise/contracts/entities';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Bucket } from 'sst/node/bucket';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({});

export const listQuestions = ApiHandler(async () => {
  const { Items: questions = [] } = await QuestionForListEntity.query(
    QuestionForListEntityName,
  );

  const response: ListQuestionsOutput = {
    questions: questions.map(
      ({ questionId, questionText, userId, username, createdAt }) => ({
        questionId,
        questionText,
        userId,
        username,
        createdAt,
      }),
    ),
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});

export const getQuestion = ApiHandler(async ({ pathParameters }) => {
  const { questionId } = pathParameters as GetQuestionPathParameters;

  const { Item: question } =
    await QuestionForDetailsEntity.get<QuestionForDetailsEntityType>({
      PK: QuestionForDetailsEntityName,
      SK: questionId,
    });

  if (question === undefined) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: `Question ${questionId} not found`,
      }),
    };
  }

  let signedUrl: string | undefined = undefined;
  if (question.fileKey !== undefined) {
    const command = new GetObjectCommand({
      Bucket: Bucket.mediaBucket.bucketName,
      Key: question.fileKey,
    });

    signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
  }

  const response: GetQuestionOutput = {
    questionId,
    questionText: question.questionText,
    userId: question.userId,
    answers: question.answers,
    signedUrl,
    username: question.username,
    createdAt: question.createdAt,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});

export const listUsers = ApiHandler(async () => {
  const { Items: users = [] } = await UserEntity.query(UserEntityName);

  const response: ListUsersOutput = {
    users: users.map(({ userId, username, score }) => ({
      userId,
      username,
      score,
    })),
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});
