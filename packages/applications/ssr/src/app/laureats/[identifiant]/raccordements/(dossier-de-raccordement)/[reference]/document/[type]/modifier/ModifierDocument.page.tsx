import { Alert } from '@codegouvfr/react-dsfr/Alert';
import type { FC } from 'react';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { TitrePageRaccordement } from '../../../../../TitrePageRaccordement';
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
        children: (
          <Alert
            severity="info"
            small
            title="Concernant le dépôt"
            description={
              <div className="py-4 text-justify">
                Le dépôt est informatif, il ne remplace pas la transmission à votre gestionnaire.
              </div>
            }
          />
        ),
      }}
    />
  );
};
