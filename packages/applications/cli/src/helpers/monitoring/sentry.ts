import { sentrySchema } from '#helpers';

export const reportCronStatus = async (slug: string, status: 'ok' | 'error') => {
  const { SENTRY_CRONS } = sentrySchema.parse(process.env);

  const monitoringUrl = new URL(SENTRY_CRONS.replace('<monitor_slug>', slug));
  monitoringUrl.searchParams.set('status', status);

  await fetch(monitoringUrl);
};
