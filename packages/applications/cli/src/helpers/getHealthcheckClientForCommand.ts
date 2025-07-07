import z from 'zod';
import { Command } from '@oclif/core';

import { getHealthcheckClient } from './healthcheck';
const configSchema = z.object({
  SENTRY_CRONS: z.string().optional(),
  APPLICATION_STAGE: z.string(),
});
export const getHealthcheckClientForCommand = (command: Command.Loadable) => {
  const { SENTRY_CRONS, APPLICATION_STAGE } = configSchema.parse(process.env);

  const slug =
    'monitoringSlug' in command && typeof command.monitoringSlug === 'string'
      ? command.monitoringSlug
      : undefined;

  return getHealthcheckClient({
    healthcheckUrl: SENTRY_CRONS,
    slug,
    environment: APPLICATION_STAGE,
  });
};
