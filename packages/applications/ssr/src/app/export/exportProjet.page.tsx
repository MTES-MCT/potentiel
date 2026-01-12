import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { PageTemplate } from '@/components/templates/Page.template';
import { Heading1 } from '@/components/atoms/headings';
import { LinkAction } from '@/components/atoms/LinkAction';

export const ExportProjetPage: FC = () => (
  <PageTemplate banner={<Heading1>Exporter des données projets</Heading1>}>
    <div className="mb-4">
      Cette page permet d'accéder à des liens pour exporter des données des projets
    </div>
    <LinkAction
      label="Exporter les données projets liées au raccordement"
      href={Routes.Raccordement.exporter}
    />
  </PageTemplate>
);
