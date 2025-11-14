import React, { FC } from 'react';
import { Alert } from '@codegouvfr/react-dsfr/Alert';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { TitrePageRaccordement } from '../../../../TitrePageRaccordement';

import {
  ModifierPropositionTechniqueEtFinancièreForm,
  ModifierPropositionTechniqueEtFinancièreFormProps,
} from './ModifierPropositionTechniqueEtFinancière.form';

export type ModifierPropositionTechniqueEtFinancièrePageProps =
  ModifierPropositionTechniqueEtFinancièreFormProps;

export const ModifierPropositionTechniqueEtFinancièrePage: FC<
  ModifierPropositionTechniqueEtFinancièrePageProps
> = ({ identifiantProjet, raccordement }: ModifierPropositionTechniqueEtFinancièrePageProps) => {
  return (
    <ColumnPageTemplate
      heading={<TitrePageRaccordement />}
      leftColumn={{
        children: (
          <ModifierPropositionTechniqueEtFinancièreForm
            identifiantProjet={identifiantProjet}
            raccordement={raccordement}
          />
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
