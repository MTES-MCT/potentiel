import type { Request } from 'express';
import React from 'react';
import { Heading1, LegacyPageTemplate, MetabaseStats } from '../components';
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
      <div className="panel">
        <Heading1>Tableau de bord</Heading1>
        <section>
          <script src="https://metabase.potentiel.beta.gouv.fr/app/iframeResizer.js"></script>
          <MetabaseStats iframeUrl={iframeUrl} />
        </section>
      </div>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(AcheteurObligeStatistiques);
