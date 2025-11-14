import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { Période } from '@potentiel-domain/periode';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { ImporterCandidaturesForm } from './ImporterCandidatures.form';

type ImporterCandidaturesPageProps = {
  périodes: PlainType<Période.ListerPériodeItemReadModel[]>;
  importMultipleAOEtPeriodesPossible: boolean;
};

export const ImporterCandidaturesPage: FC<ImporterCandidaturesPageProps> = ({
  périodes,
  importMultipleAOEtPeriodesPossible,
}) => (
  <PageTemplate banner={<Heading1>Importer des candidats</Heading1>}>
    <ImporterCandidaturesForm
      périodes={périodes}
      importMultipleAOEtPeriodesPossible={importMultipleAOEtPeriodesPossible}
    />
  </PageTemplate>
);
