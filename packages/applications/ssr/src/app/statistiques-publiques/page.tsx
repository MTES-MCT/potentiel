import { Metadata } from 'next';
import jwt from 'jsonwebtoken';

import { getLogger } from '@potentiel-libraries/monitoring';

import { StatistiquesPubliquesPage } from '@/components/pages/statistiques-publiques/StatistiquesPubliques.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

export const metadata: Metadata = {
  title: 'Statistiques - Potentiel',
};

export default async function Page() {
  return PageWithErrorHandling(async () => {
    const { METABASE_PUBLIC_SITE_URL, METABASE_PUBLIC_SECRET_KEY } = process.env;

    if (!METABASE_PUBLIC_SITE_URL || !METABASE_PUBLIC_SECRET_KEY) {
      getLogger().error(
        'Missing METABASE_PUBLIC_SITE_URL and/or METABASE_PUBLIC_SECRET_KEY environment variables',
      );
      throw new Error(
        'Missing METABASE_PUBLIC_SITE_URL and/or METABASE_PUBLIC_SECRET_KEY environment variables',
      );
    }

    const tokenForMainDashboard = jwt.sign(
      {
        resource: { dashboard: 2 },
        params: {},
        exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
      },
      METABASE_PUBLIC_SECRET_KEY,
    );

    const tokenForMapDashboard = jwt.sign(
      {
        resource: { dashboard: 3 },
        params: {},
        exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
      },
      METABASE_PUBLIC_SECRET_KEY,
    );

    const mainDashboardIframeUrl = new URL(
      `${METABASE_PUBLIC_SITE_URL}/embed/dashboard/${tokenForMainDashboard}#bordered=false&titled=false`,
    );

    const mapDashboardIframeUrl = new URL(
      `${METABASE_PUBLIC_SITE_URL}/embed/dashboard/${tokenForMapDashboard}#bordered=false&titled=false`,
    );

    return (
      <>
        <StatistiquesPubliquesPage
          mainDashboardIframeUrl={mainDashboardIframeUrl.toString()}
          mapDashboardIframeUrl={mapDashboardIframeUrl.toString()}
        />
        ;
      </>
    );
  });
}
