export const reportCronStatus = async (slug: string, status: 'ok' | 'error') => {
  const { SENTRY_CRONS } = process.env;
  if (!SENTRY_CRONS) {
    console.warn('SENTRY_CRONS env var is missing');
    return;
  }

  const monitoringUrl = new URL(SENTRY_CRONS.replace('<monitor_slug>', slug));
  monitoringUrl.searchParams.set('status', status);

  await fetch(monitoringUrl);
};
