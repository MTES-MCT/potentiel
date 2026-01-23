import { Hook } from '@oclif/core';
import z from 'zod';

import { getHealthcheckClient } from '../../helpers/healthcheck.js';

import { CommandWithHealthcheckClient } from './finally.js';

const configSchema = z.object({
  SENTRY_CRONS: z.string(),
  APPLICATION_STAGE: z.string(),
});

type CommandWithHealthCheckConfiguration = {
  monitoringSlug?: string;
};

/**
 * Before running the actual command, notify Sentry that the command started,
 * if `monitoringSlug` was specified.
 */
const healthcheckPrerunHook: Hook.Prerun = async function ({ Command }) {
  const { success, data } = configSchema.safeParse(process.env);

  const command = Command as CommandWithHealthCheckConfiguration & CommandWithHealthcheckClient;

  if (!success || !command.monitoringSlug) {
    return;
  }

  const { SENTRY_CRONS, APPLICATION_STAGE } = data;
  // The healtcheck client generates a uuid that's required to notify the service, so it should be instanciated twice
  command._healthcheckClient = getHealthcheckClient({
    healthcheckUrl: SENTRY_CRONS,
    slug: command.monitoringSlug,
    environment: APPLICATION_STAGE,
  });

  await command._healthcheckClient.start();
};

export default healthcheckPrerunHook;
