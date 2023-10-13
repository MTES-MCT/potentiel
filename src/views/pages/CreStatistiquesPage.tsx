import type { Request } from 'express';
import React from 'react';
import { Heading1 } from '@potentiel/ui';
import { LegacyPageTemplate } from '../components';
import { hydrateOnClient } from '../helpers';

type CreStatistiquesPageProps = {
  request: Request;
  iframeUrl: string;
};

export const CreStatistiques = ({ iframeUrl, request }: CreStatistiquesPageProps) => {
  return (
    <LegacyPageTemplate user={request.user} currentPage="cre-statistiques">
      <Heading1>Tableau de bord</Heading1>
      <section>
        <script src="https://metabase.potentiel.beta.gouv.fr/app/iframeResizer.js" />
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
    </LegacyPageTemplate>
  );
};

hydrateOnClient(CreStatistiques);
