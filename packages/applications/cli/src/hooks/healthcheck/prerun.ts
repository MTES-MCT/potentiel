import { Hook } from '@oclif/core';
import z from 'zod';

import { getHealthcheckClient } from '../../helpers/healthcheck';

import { CommandWithHealthcheckClient } from './finally';

const configSchema = z.object({
  SENTRY_CRONS: z.string().optional(),
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
  const { SENTRY_CRONS, APPLICATION_STAGE } = configSchema.parse(process.env);

  const command = Command as CommandWithHealthCheckConfiguration & CommandWithHealthcheckClient;

  // The healtcheck client generates a uuid that's required to notify the service, so it should be instanciated twice
  command._healthcheckClient = getHealthcheckClient({
    healthcheckUrl: SENTRY_CRONS,
    slug: command.monitoringSlug,
    environment: APPLICATION_STAGE,
  });

  await command._healthcheckClient.start();
};

export default healthcheckPrerunHook;
