import type { Hook } from '@oclif/core';
import dotenv from 'dotenv';

import { setupLogger } from '../helpers/setupLogger';

const hook: Hook<'init'> = async ({ argv, id }) => {
  dotenv.config();
  setupLogger({
    defaultMeta: { application: 'cli', argv, command: id },
  });
};

export default hook;
