import type { Request } from 'express';
import React from 'react';
import { Heading1, PageTemplate } from '@components';
import { hydrateOnClient } from '../helpers';

type CreStatistiquesPageProps = {
  request: Request;
  iframeUrl: string;
};

export const CreStatistiques = ({ iframeUrl, request }: CreStatistiquesPageProps) => {
  return (
    <PageTemplate user={request.user} currentPage="cre-statistiques">
      <main role="main" className="panel">
        <div className="panel__header">
          <Heading1>Tableau de bord</Heading1>
        </div>
        <section className="section section-white pt-0">
          <script src="https://metabase.potentiel.beta.gouv.fr/app/iframeResizer.js" />
          <div
            className="container"
            dangerouslySetInnerHTML={{
              __html: `<iframe
            src="${iframeUrl}"
            frameBorder="0"
            width="100%"
            allowTransparency
            onload="iFrameResize({}, this)"
          ></iframe>`,
            }}
          />
        </section>
      </main>
    </PageTemplate>
  );
};

hydrateOnClient(CreStatistiques);
