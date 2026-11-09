import type { Hook } from '@oclif/core';

import { getLogger } from '@potentiel-libraries/monitoring';

import type { HealthcheckClient } from '#helpers';

export type CommandWithHealthcheckClient = { _healthcheckClient?: HealthcheckClient };

/**
 * After running the command, signal success or error to the healthcheck service
 */
const healthcheckFinallyHook: Hook.Finally = async ({ Command, error }) => {
  if (error) {
    getLogger().error(error);
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
