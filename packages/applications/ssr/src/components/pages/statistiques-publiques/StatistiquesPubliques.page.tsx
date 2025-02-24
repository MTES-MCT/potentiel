/* eslint-disable react/no-unknown-property */
'use client';

import React from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { Heading1 } from '@/components/atoms/headings';

type StatistiquesPubliquesPageProps = {
  mainDashboardIframeUrl: string;
  mapDashboardIframeUrl: string;
};
export function StatistiquesPubliquesPage({
  mainDashboardIframeUrl,
  mapDashboardIframeUrl,
}: StatistiquesPubliquesPageProps) {
  return (
    <PageTemplate>
      <Heading1>Potentiel en chiffres</Heading1>
      <div>Au service des porteurs de projet</div>

      <div className="mt-20 min-h-screen">
        <iframe src={mainDashboardIframeUrl} className="w-full min-h-full" allowTransparency />
        <iframe src={mapDashboardIframeUrl} className="w-full min-h-full" allowTransparency />
      </div>
    </PageTemplate>
  );
}
