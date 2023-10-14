import { StackContext, Api, StaticSite, Table } from 'sst/constructs';
import { BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import { PK, SK } from '../constants';

export function API({ stack }: StackContext) {
  const table = new Table(stack, 'table', {
    fields: {
      [PK]: 'string',
      [SK]: 'string',
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
  });

  const api = new Api(stack, 'api', {
    defaults: {
      function: {
        bind: [table],
      },
    },
    routes: {
      'GET /users': 'packages/functions/src/lambda.listUsers',
      'POST /users': 'packages/functions/src/lambda.createUser',
    },
  });

  const web = new StaticSite(stack, 'frontend', {
    path: 'packages/frontend',
    buildOutput: 'dist',
    buildCommand: 'pnpm run build',
    environment: {
      VITE_APP_API_URL: api.url,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    FrontendUrl: web.url,
  });
}
