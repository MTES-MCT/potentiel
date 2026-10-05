import type { FC } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import type { Période } from '@potentiel-domain/periode';

import { featureFlag } from '@/app/_helpers/getFeatureFlag';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';
import { ImporterCandidaturesForm } from './ImporterCandidatures.form';

type ImporterCandidaturesPageProps = {
  périodes: PlainType<Période.ListerPériodeItemReadModel[]>;
  importMultipleAOEtPeriodesPossible: boolean;
  estUnReimport: boolean;
  afficherAlerteLimiteImport?: true;
};

export const ImporterCandidaturesPage: FC<ImporterCandidaturesPageProps> = ({
  périodes,
  importMultipleAOEtPeriodesPossible,
  estUnReimport,
}) => (
  <PageTemplate banner={<Heading1>Importer des candidats</Heading1>}>
    <ImporterCandidaturesForm
      périodes={périodes}
      importMultipleAOEtPeriodesPossible={importMultipleAOEtPeriodesPossible}
      estUnReimport={estUnReimport}
      afficherAlerteLimiteImport={featureFlag.includes('import-dn-par-dossiers')}
    />
  </PageTemplate>
);
