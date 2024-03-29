import type { Request } from 'express';
import React from 'react';
import { Heading1, LegacyPageTemplate } from '../components';
import { hydrateOnClient } from '../helpers';

type AdminStatistiquesProps = {
  request: Request;
  iframeUrl: string;
};

export const AdminStatistiques = ({ iframeUrl, request }: AdminStatistiquesProps) => {
  return (
    <LegacyPageTemplate user={request.user} currentPage="admin-statistiques">
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
    </LegacyPageTemplate>
  );
};

hydrateOnClient(AdminStatistiques);
