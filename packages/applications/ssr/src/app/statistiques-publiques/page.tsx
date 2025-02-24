import { Metadata } from 'next';
import { SignJWT } from 'jose';
import { z } from 'zod';

import { StatistiquesPubliquesPage } from '@/components/pages/statistiques-publiques/StatistiquesPubliques.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

export const metadata: Metadata = {
  title: 'Statistiques - Potentiel',
};

const schema = z.object({
  METABASE_PUBLIC_SITE_URL: z.string(),
  METABASE_PUBLIC_SECRET_KEY: z.string(),
  METABASE_PUBLIC_DASHBOARD_ID: z.coerce.number(),
  METABASE_PUBLIC_DASHBOARD_MAP_ID: z.coerce.number(),
});

export default async function Page() {
  return PageWithErrorHandling(async () => {
    const {
      METABASE_PUBLIC_SITE_URL,
      METABASE_PUBLIC_SECRET_KEY,
      METABASE_PUBLIC_DASHBOARD_ID,
      METABASE_PUBLIC_DASHBOARD_MAP_ID,
    } = schema.parse(process.env);

    const tokenForMainDashboard = await new SignJWT({
      resource: { dashboard: METABASE_PUBLIC_DASHBOARD_ID },
      params: {},
    })
      .setIssuedAt()
      .setExpirationTime('10m')
      .setProtectedHeader({ alg: 'HS256' })
      .sign(new TextEncoder().encode(METABASE_PUBLIC_SECRET_KEY));

    const tokenForMapDashboard = await new SignJWT({
      resource: { dashboard: METABASE_PUBLIC_DASHBOARD_MAP_ID },
      params: {},
    })
      .setIssuedAt()
      .setExpirationTime('10m')
      .setProtectedHeader({ alg: 'HS256' })
      .sign(new TextEncoder().encode(METABASE_PUBLIC_SECRET_KEY));

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
