import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import jwt from 'jsonwebtoken';
import Script from 'next/script';

import { StatistiquesPubliquesPage } from '@/components/pages/statistiques-publiques/StatistiquesPubliques.page';

export const metadata: Metadata = {
  title: 'Statistiques - Potentiel',
};

export default async function Page() {
  console.log(`🇫🇷`, process.env);

  if (!process.env.METABASE_SITE_URL || !process.env.METABASE_SECRET_KEY) {
    return notFound();
  }

  const tokenForMainDashboard = jwt.sign(
    {
      resource: { dashboard: 2 },
      params: {},
      exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
    },
    process.env.METABASE_SECRET_KEY,
  );

  const tokenForMapDashboard = jwt.sign(
    {
      resource: { dashboard: 3 },
      params: {},
      exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
    },
    process.env.METABASE_SECRET_KEY,
  );

  const mainDashboardIframeUrl = new URL(
    `${process.env.METABASE_SITE_URL}/embed/dashboard/${tokenForMainDashboard}#bordered=false&titled=false`,
  ).toString();

  const mapDashboardIframeUrl = new URL(
    `${process.env.METABASE_SITE_URL}/embed/dashboard/${tokenForMapDashboard}#bordered=false&titled=false`,
  ).toString();

  return (
    <>
      <Script
        src="https://metabase.potentiel.beta.gouv.fr/app/iframeResizer.js"
        strategy="beforeInteractive"
      />
      <StatistiquesPubliquesPage
        mainDashboardIframeUrl={mainDashboardIframeUrl}
        mapDashboardIframeUrl={mapDashboardIframeUrl}
      />
      ;
    </>
  );
}
