import type { FC } from 'react';

import { SectionPage } from '@/components/atoms/section/SectionPage';
import {
  TransmettreDocumentForm,
  type TransmettreDocumentFormProps,
} from './TransmettreDocument.form';

export type TransmettreDocumentPageProps = TransmettreDocumentFormProps;

export const TransmettreDocumentPage: FC<TransmettreDocumentPageProps> = ({
  identifiantProjet,
  referenceDossierRaccordement,
  availableTypes,
}) => (
  <SectionPage>
    <TransmettreDocumentForm
      identifiantProjet={identifiantProjet}
      referenceDossierRaccordement={referenceDossierRaccordement}
      availableTypes={availableTypes}
    />
  </SectionPage>
);
