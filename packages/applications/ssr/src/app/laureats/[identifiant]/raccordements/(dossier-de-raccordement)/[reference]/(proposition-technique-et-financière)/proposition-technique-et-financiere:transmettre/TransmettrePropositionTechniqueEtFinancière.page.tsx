import React, { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { TitrePageRaccordement } from '../../../../TitrePageRaccordement';

import {
  TransmettrePropositionTechniqueEtFinancièreForm,
  TransmettrePropositionTechniqueEtFinancièreFormProps,
} from './TransmettrePropositionTechniqueEtFinancière.form';

export type TransmettrePropositionTechniqueEtFinancièrePageProps = {
  identifiantProjet: TransmettrePropositionTechniqueEtFinancièreFormProps['identifiantProjet'];
  referenceDossierRaccordement: TransmettrePropositionTechniqueEtFinancièreFormProps['referenceDossierRaccordement'];
};

export const TransmettrePropositionTechniqueEtFinancièrePage: FC<
  TransmettrePropositionTechniqueEtFinancièrePageProps
> = ({ identifiantProjet, referenceDossierRaccordement }) => (
  <ColumnPageTemplate
    heading={<TitrePageRaccordement />}
    leftColumn={{
      children: (
        <TransmettrePropositionTechniqueEtFinancièreForm
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
              démarches administratives avec le cocontractant connecté à Potentiel, notamment pour
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
