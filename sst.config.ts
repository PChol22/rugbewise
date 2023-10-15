import { SSTConfig } from 'sst';
import { Backend } from './stacks/Backend';

export default {
  config(_input) {
    return {
      name: 'rugbewise',
      region: 'eu-west-1',
    };
  },
  stacks(app) {
    app.stack(Backend);
  },
} satisfies SSTConfig;
