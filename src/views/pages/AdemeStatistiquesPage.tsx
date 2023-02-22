import type { Request } from 'express';
import React from 'react';
import { Heading1, PageTemplate } from '@components';
import { hydrateOnClient } from '../helpers';

type AdemeStatistiquesProps = {
  request: Request;
  iframeUrl: string;
};

export const AdemeStatistiques = ({ iframeUrl, request }: AdemeStatistiquesProps) => {
  return (
    <PageTemplate user={request.user} currentPage="ademe-statistiques">
      <main role="main" className="panel">
        <div className="panel__header">
          <Heading1>Tableau de bord</Heading1>
        </div>
        <section className="section section-white" style={{ paddingTop: 0 }}>
          <script src="https://metabase.potentiel.beta.gouv.fr/app/iframeResizer.js"></script>
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
          ></div>
        </section>
      </main>
    </PageTemplate>
  );
};

hydrateOnClient(AdemeStatistiques);
