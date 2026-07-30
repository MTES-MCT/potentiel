import type { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
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
  <PageTemplate>
    <TransmettreDocumentForm
      identifiantProjet={identifiantProjet}
      referenceDossierRaccordement={referenceDossierRaccordement}
      availableTypes={availableTypes}
    />
  </PageTemplate>
  //   classes={{ right: 'flex flex-1', left: 'flex flex-1' }}
  //   leftColumn={{
  //     children: (
  //       <TransmettreDocumentForm
  //         identifiantProjet={identifiantProjet}
  //         referenceDossierRaccordement={referenceDossierRaccordement}
  //         availableTypes={availableTypes}
  //       />
  //     ),
  //   }}
  //   rightColumn={{
  //     children: <TransmettreOuModifierDocumentAlert />,
  //   }}
  // />
);
