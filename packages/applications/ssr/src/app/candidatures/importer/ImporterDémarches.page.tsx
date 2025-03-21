import { PlainType } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { ImporterDémarchesForm } from './ds/ImporterDémarches.form';

type ImporterDémarchesPageProps = {
  appelsOffre: PlainType<AppelOffre.AppelOffreReadModel[]>;
};
export const ImporterDémarchesPage = ({ appelsOffre }: ImporterDémarchesPageProps) => (
  <ColumnPageTemplate
    banner={<Heading1 className="text-theme-white">Importer des candidats</Heading1>}
    leftColumn={{ children: <ImporterDémarchesForm appelsOffre={appelsOffre} /> }}
    rightColumn={{
      children: <></>,
    }}
  />
);
