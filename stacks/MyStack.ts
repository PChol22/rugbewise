import { StackContext, Api, StaticSite, Table } from 'sst/constructs';
import { BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import { GSI1, GSI1_PK, GSI1_SK, PK, SK } from '../constants';
import { HostedZone } from 'aws-cdk-lib/aws-route53';

export function API({ stack }: StackContext) {
  const table = new Table(stack, 'table', {
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

  const api = new Api(stack, 'api', {
    defaults: {
      function: {
        bind: [table],
      },
    },
    routes: {
      'GET /users': 'packages/functions/src/user.listUsers',
      'POST /users': 'packages/functions/src/user.createUser',
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
}
