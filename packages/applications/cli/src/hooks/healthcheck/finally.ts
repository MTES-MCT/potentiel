import { Hook } from '@oclif/core';

import { HealthcheckClient } from '../../helpers/healthcheck';

export type CommandWithHealthcheckClient = { _healthcheckClient?: HealthcheckClient };

/**
 * After running the command, signal success or error to the healthcheck service
 */
const healthcheckFinallyHook: Hook.Finally = async function ({ Command, error }) {
  if (error) {
    console.log(error);
  }
  const command = (await Command?.load()) as CommandWithHealthcheckClient | undefined;
  if (command?._healthcheckClient) {
    if (error) {
      await command?._healthcheckClient.error();
    } else {
      await command?._healthcheckClient.success();
    }
  }
};

export default healthcheckFinallyHook;
