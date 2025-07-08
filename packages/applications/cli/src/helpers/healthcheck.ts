import { getLogger } from '@potentiel-libraries/monitoring';

type GetHealthcheckClientProps = {
  healthcheckUrl: string | undefined;
  environment: string;
  slug: string | undefined;
};
export function getHealthcheckClient({
  environment,
  healthcheckUrl,
  slug,
}: GetHealthcheckClientProps) {
  if (!healthcheckUrl || !slug) {
    return {
      async start() {},
      async success() {},
      async error() {},
    };
  }

  const uuid = crypto.randomUUID();
  const notify = async (status: string) => {
    const url = new URL(healthcheckUrl.replace('<monitor_slug>', slug));
    url.searchParams.set('check_in_id', uuid);
    url.searchParams.set('status', status);
    url.searchParams.set('environment', environment);

    try {
      await fetch(url);
    } catch (e) {
      getLogger().error(`Healtcheck failed: ${e}`);
    }
  };

  return {
    start: () => notify('in_progress'),
    success: () => notify('ok'),
    error: () => notify('error'),
  };
}

export type HealthcheckClient = ReturnType<typeof getHealthcheckClient>;
