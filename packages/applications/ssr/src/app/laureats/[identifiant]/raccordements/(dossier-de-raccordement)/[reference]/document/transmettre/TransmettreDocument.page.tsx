import Alert from '@codegouvfr/react-dsfr/Alert';
import type { FC } from 'react';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { TitrePageRaccordement } from '../../../../TitrePageRaccordement';
import {
  TransmettreDocumentForm,
  type TransmettreDocumentFormProps,
} from './TransmettreDocument.form';

export type TransmettreDocumentPageProps = {
  identifiantProjet: TransmettreDocumentFormProps['identifiantProjet'];
  referenceDossierRaccordement: TransmettreDocumentFormProps['referenceDossierRaccordement'];
};

export const TransmettreDocumentPage: FC<TransmettreDocumentPageProps> = ({
  identifiantProjet,
  referenceDossierRaccordement,
}) => (
  <ColumnPageTemplate
    heading={<TitrePageRaccordement />}
    leftColumn={{
      children: (
        <TransmettreDocumentForm
          identifiantProjet={identifiantProjet}
          referenceDossierRaccordement={referenceDossierRaccordement}
        />
      ),
    }}
    rightColumn={{
      children: (
        <Alert
          severity="info"
          small
          description={
            <div className="py-4 text-justify">
              La proposition technique et financière transmise sur Potentiel facilitera vos
              démarches administratives avec le Cocontractant connecté à Potentiel, notamment pour
              des retards de délai de raccordement.
              <br /> Le dépôt dans Potentiel est informatif, il ne remplace pas la transmission à
              votre gestionnaire de réseau.
            </div>
          }
        />
      ),
    }}
  />
);
