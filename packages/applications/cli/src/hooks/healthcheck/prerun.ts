import { Hook } from '@oclif/core';

import { getHealthcheckClientForCommand } from '../../helpers/getHealthcheckClientForCommand';

const healthcheckPrerunHook: Hook.Prerun = async function ({ Command }) {
  const client = getHealthcheckClientForCommand(Command);
  await client.start();
};

export default healthcheckPrerunHook;
