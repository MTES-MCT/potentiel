import type { FC } from 'react';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { TransmettreOuModifierDocumentAlert } from '../../../components/TransmettreModifierDocumentAlert';
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
  <ColumnPageTemplate
    leftColumn={{
      children: (
        <TransmettreDocumentForm
          identifiantProjet={identifiantProjet}
          referenceDossierRaccordement={referenceDossierRaccordement}
          availableTypes={availableTypes}
        />
      ),
    }}
    rightColumn={{
      children: <TransmettreOuModifierDocumentAlert />,
    }}
  />
);
