import type { Request } from 'express';
import React from 'react';
import { Heading1, LegacyPageTemplate } from '@components';
import { hydrateOnClient } from '../helpers';

type AcheteurObligeStatistiquesProps = {
  request: Request;
  iframeUrl: string;
};

export const AcheteurObligeStatistiques = ({
  iframeUrl,
  request,
}: AcheteurObligeStatistiquesProps) => {
  return (
    <LegacyPageTemplate user={request.user} currentPage="acheteur-oblige-statistiques">
      <main role="main" className="panel">
        <Heading1>Tableau de bord</Heading1>
        <section>
          <script src="https://metabase.potentiel.beta.gouv.fr/app/iframeResizer.js"></script>
          <div
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
    </LegacyPageTemplate>
  );
};

hydrateOnClient(AcheteurObligeStatistiques);
