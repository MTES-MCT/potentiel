import { Hook } from '@oclif/core';

import { killPool } from '@potentiel-libraries/pg-helpers';

const hook: Hook.Finally = async function () {
  await killPool();
};

export default hook;
