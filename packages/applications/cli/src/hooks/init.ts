import { Hook } from '@oclif/core';
import dotenv from 'dotenv';

import { createLogger, initLogger } from '@potentiel-libraries/monitoring';

const hook: Hook<'init'> = async function () {
  dotenv.config();
  initLogger(createLogger({}));
};

export default hook;
