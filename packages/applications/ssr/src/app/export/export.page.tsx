import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { PageTemplate } from '@/components/templates/Page.template';
import { Heading1 } from '@/components/atoms/headings';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export type ExportPageProps = {
  actions: Array<'exporter-raccordement' | 'lister-lauréat-enrichi' | 'lister-éliminé-enrichi'>;
};

export const ExportPage: FC<ExportPageProps> = ({ actions }) => (
  <PageTemplate banner={<Heading1>Exporter des données</Heading1>} feature={'export'}>
    <div>
      {actions.includes('exporter-raccordement') && (
        <DownloadDocument
          label="Exporter les données de raccordement"
          url={Routes.Raccordement.exporter}
          format="csv"
        />
      )}
    </div>
    <div>
      {actions.includes('lister-lauréat-enrichi') && (
        <DownloadDocument
          label="Exporter les lauréats"
          url={Routes.Lauréat.exporter({})}
          format="csv"
        />
      )}
    </div>
    <div>
      {actions.includes('lister-éliminé-enrichi') && (
        <DownloadDocument
          label="Exporter les éliminés"
          url={Routes.Éliminé.exporter({})}
          format="csv"
        />
      )}
    </div>
  </PageTemplate>
);
