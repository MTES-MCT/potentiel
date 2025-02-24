'use client';

import React from 'react';
import IframeResizer from '@iframe-resizer/react';

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
        <IframeResizer
          license="GPLv3"
          src={mainDashboardIframeUrl}
          style={{ width: '100%', height: '100vh' }}
        />
        <IframeResizer
          license="GPLv3"
          src={mapDashboardIframeUrl}
          style={{ width: '100%', height: '100vh' }}
        />
      </div>
    </PageTemplate>
  );
}
