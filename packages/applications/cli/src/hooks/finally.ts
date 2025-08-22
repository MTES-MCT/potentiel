import type { Hook } from '@oclif/core';

import { killPool } from '@potentiel-libraries/pg-helpers';

const hook: Hook.Finally = async () => {
  await killPool();
};

export default hook;
