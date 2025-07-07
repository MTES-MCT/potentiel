import { Hook } from '@oclif/core';

import { getHealthcheckClientForCommand } from '../../helpers/getHealthcheckClientForCommand';

const healthcheckPostrunHook: Hook.Finally = async function ({ Command, error }) {
  if (Command) {
    const client = getHealthcheckClientForCommand(Command);
    if (error) {
      await client.error();
    } else {
      await client.success();
    }
  }
};

export default healthcheckPostrunHook;
