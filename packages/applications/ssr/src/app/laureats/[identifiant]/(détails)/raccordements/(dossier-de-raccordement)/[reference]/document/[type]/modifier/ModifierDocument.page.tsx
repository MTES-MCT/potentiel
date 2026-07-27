import type { FC } from 'react';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { TitrePageRaccordement } from '../../../../../TitrePageRaccordement';
import { TransmettreOuModifierDocumentAlert } from '../../../../components/TransmettreModifierDocumentAlert';
import { ModifierDocumentForm, type ModifierDocumentFormProps } from './ModifierDocument.form';

export type ModifierDocumentPageProps = ModifierDocumentFormProps;

export const ModifierDocumentPage: FC<ModifierDocumentPageProps> = ({
  identifiantProjet,
  raccordement,
}: ModifierDocumentPageProps) => {
  return (
    <ColumnPageTemplate
      heading={<TitrePageRaccordement />}
      leftColumn={{
        children: (
          <ModifierDocumentForm identifiantProjet={identifiantProjet} raccordement={raccordement} />
        ),
      }}
      rightColumn={{
        children: <TransmettreOuModifierDocumentAlert />,
      }}
    />
  );
};
