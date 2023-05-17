import type { Request } from 'express';
import React from 'react';
import { Heading1, LegacyPageTemplate } from '@components';
import { hydrateOnClient } from '../helpers';

type AdemeStatistiquesProps = {
  request: Request;
  iframeUrl: string;
};

export const AdemeStatistiques = ({ iframeUrl, request }: AdemeStatistiquesProps) => {
  return (
    <LegacyPageTemplate user={request.user} currentPage="ademe-statistiques">
      <Heading1>Tableau de bord</Heading1>
      <section>
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
    </LegacyPageTemplate>
  );
};

hydrateOnClient(AdemeStatistiques);
