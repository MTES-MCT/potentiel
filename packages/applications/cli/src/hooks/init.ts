import { Hook } from '@oclif/core';
import dotenv from 'dotenv';

import { createLogger, initLogger } from '@potentiel-libraries/monitoring';

const hook: Hook<'init'> = async function ({ argv, id }) {
  dotenv.config();
  initLogger(
    createLogger({
      defaultMeta: { application: 'cli', argv, command: id },
    }),
  );
};

export default hook;
