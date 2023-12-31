import {
  StackContext,
  Api,
  StaticSite,
  Table,
  EventBus,
  Queue,
  Bucket,
} from 'sst/constructs';
import { BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import {
  GSI1,
  GSI1_PK,
  GSI1_SK,
  PK,
  QUESTIONS_EVENT_STORE_ID,
  SK,
  USERS_EVENT_STORE_ID,
} from '../constants';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { StartingPosition } from 'aws-cdk-lib/aws-lambda';

export const Backend = ({ stack }: StackContext) => {
  const projectionsTable = new Table(stack, 'projectionsTable', {
    fields: {
      [PK]: 'string',
      [SK]: 'string',
      [GSI1_PK]: 'string',
      [GSI1_SK]: 'string',
    },
    primaryIndex: {
      partitionKey: PK,
      sortKey: SK,
    },
    cdk: {
      table: {
        billingMode: BillingMode.PAY_PER_REQUEST,
      },
    },
    globalIndexes: {
      [GSI1]: {
        partitionKey: GSI1_PK,
        sortKey: GSI1_SK,
      },
    },
  });

  const eventBus = new EventBus(stack, 'eventBus', {});
  eventBus.addRules(stack, {
    usersProjection: {
      targets: {
        usersProjection: {
          function: {
            handler: 'packages/functions/src/projection.usersProjection',
            bind: [projectionsTable],
          },
        },
      },
      pattern: { source: [USERS_EVENT_STORE_ID] },
    },
    questionsProjection: {
      targets: {
        questionsProjection: {
          function: {
            handler: 'packages/functions/src/projection.questionsProjection',
            bind: [projectionsTable],
          },
        },
      },
      pattern: { source: [QUESTIONS_EVENT_STORE_ID] },
    },
  });

  const eventsTable = new Table(stack, 'eventsTable', {
    fields: {
      aggregateId: 'string',
      version: 'number',
      eventStoreId: 'string',
      timestamp: 'string',
    },
    primaryIndex: {
      partitionKey: 'aggregateId',
      sortKey: 'version',
    },
    globalIndexes: {
      initialEvents: {
        partitionKey: 'eventStoreId',
        sortKey: 'timestamp',
        projection: 'keys_only',
      },
    },
    stream: 'new_image',
  });

  eventsTable.addConsumers(stack, {
    eventsFanout: {
      function: {
        handler: 'packages/functions/src/eventsFanout.handler',
        bind: [eventsTable, eventBus],
      },
      cdk: {
        eventSource: {
          batchSize: 10,
          startingPosition: StartingPosition.LATEST,
        },
      },
    },
  });

  const deadLetterQueue = new Queue(stack, 'deadLetterQueue', {
    cdk: {
      queue: {
        fifo: true,
      },
    },
  });

  const editQuestionQueue = new Queue(stack, 'editQuestionQueue', {
    consumer: {
      function: {
        handler: 'packages/functions/src/commands.editQuestion',
        bind: [eventsTable],
      },
    },
    cdk: {
      queue: {
        fifo: true,
        deadLetterQueue: {
          queue: deadLetterQueue.cdk.queue,
          maxReceiveCount: 3,
        },
      },
    },
  });

  const mediaBucket = new Bucket(stack, 'mediaBucket', {});

  const api = new Api(stack, 'api', {
    routes: {
      'POST /users': {
        function: {
          handler: 'packages/functions/src/signin.createUser',
          bind: [eventsTable, projectionsTable],
        },
      },
      'POST /questions': {
        function: {
          handler: 'packages/functions/src/commands.createQuestion',
          bind: [eventsTable, mediaBucket],
        },
      },
      'POST /questions/{questionId}/answers': {
        function: {
          handler: 'packages/functions/src/commands.answerQuestion',
          bind: [editQuestionQueue, eventsTable],
        },
      },
      'POST /questions/{questionId}/answers/{answerId}/upVote': {
        function: {
          handler: 'packages/functions/src/commands.upVoteAnswer',
          bind: [editQuestionQueue, eventsTable],
        },
      },
      'POST /questions/{questionId}/answers/{answerId}/downVote': {
        function: {
          handler: 'packages/functions/src/commands.downVoteAnswer',
          bind: [editQuestionQueue, eventsTable],
        },
      },
      'GET /questions': {
        function: {
          handler: 'packages/functions/src/entities.listQuestions',
          bind: [projectionsTable],
        },
      },
      'GET /questions/{questionId}': {
        function: {
          handler: 'packages/functions/src/entities.getQuestion',
          bind: [projectionsTable, mediaBucket],
        },
      },
      'GET /users': {
        function: {
          handler: 'packages/functions/src/entities.listUsers',
          bind: [projectionsTable],
        },
      },
      'POST /login': {
        function: {
          handler: 'packages/functions/src/login.login',
          bind: [projectionsTable],
        },
      },
      'POST /medias/upload-url': {
        function: {
          handler: 'packages/functions/src/medias.getUploadUrl',
          bind: [mediaBucket],
        },
      },
    },
  });

  const hostedZone = HostedZone.fromHostedZoneAttributes(stack, 'hostedZone', {
    zoneName: 'pchol.fr',
    hostedZoneId: 'Z03300451ZPNQ7JFRYW48',
  });

  const web = new StaticSite(stack, 'frontend', {
    path: 'packages/frontend',
    buildOutput: 'dist',
    buildCommand: 'pnpm run build',
    environment: {
      VITE_APP_API_URL: api.url,
    },
    customDomain: {
      domainName: 'rugbewise.pchol.fr',
      cdk: {
        hostedZone,
      },
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    FrontendUrl: web.customDomainUrl,
  });
};
