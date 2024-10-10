import type { Request } from 'express';
import React from 'react';
import { Heading1, LegacyPageTemplate, MetabaseStats } from '../components';
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
        <MetabaseStats iframeUrl={iframeUrl} />
      </section>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(AdemeStatistiques);
