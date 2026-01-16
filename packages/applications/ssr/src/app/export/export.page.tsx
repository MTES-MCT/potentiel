import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { PageTemplate } from '@/components/templates/Page.template';
import { Heading1 } from '@/components/atoms/headings';
import { LinkAction } from '@/components/atoms/LinkAction';

export type ExportPageProps = {
  actions: Array<'exporter-raccordement'>;
};

export const ExportPage: FC<ExportPageProps> = ({ actions }) => (
  <PageTemplate banner={<Heading1>Exporter des données projets</Heading1>} feature={'export'}>
    <div className="mb-4">
      Cette page permet d'accéder à des liens pour exporter des données projets
    </div>

    {actions.includes('exporter-raccordement') && (
      <LinkAction label="Exporter les données raccordement" href={Routes.Raccordement.exporter} />
    )}
  </PageTemplate>
);
