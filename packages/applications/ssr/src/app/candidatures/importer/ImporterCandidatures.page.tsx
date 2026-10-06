import type { FC } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import type { Période } from '@potentiel-domain/periode';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';
import { ImporterCandidaturesForm } from './ImporterCandidatures.form';

type ImporterCandidaturesPageProps = {
  périodes: PlainType<Période.ListerPériodeItemReadModel[]>;
  importMultipleAOEtPeriodesPossible: boolean;
  estUnReimport: boolean;
  afficherAlerteLimiteImport?: true;
  nbMaxDeProjetsImportésALaFois?: number;
};

export const ImporterCandidaturesPage: FC<ImporterCandidaturesPageProps> = ({
  périodes,
  importMultipleAOEtPeriodesPossible,
  estUnReimport,
  nbMaxDeProjetsImportésALaFois,
}) => (
  <PageTemplate banner={<Heading1>Importer des candidats</Heading1>}>
    <ImporterCandidaturesForm
      périodes={périodes}
      importMultipleAOEtPeriodesPossible={importMultipleAOEtPeriodesPossible}
      estUnReimport={estUnReimport}
      nbMaxDeProjetsImportésALaFois={nbMaxDeProjetsImportésALaFois}
    />
  </PageTemplate>
);
