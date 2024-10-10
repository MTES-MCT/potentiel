import type { Request } from 'express';
import React from 'react';
import { Heading1, LegacyPageTemplate, MetabaseStats } from '../components';
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
        <MetabaseStats iframeUrl={iframeUrl} />
      </section>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(AdminStatistiques);
