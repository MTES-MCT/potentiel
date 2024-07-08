import React, { FC } from 'react';
import { Alert } from '@codegouvfr/react-dsfr/Alert';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';

import { ModifierPropositionTechniqueEtFinancièreForm } from './ModifierPropositionTechniqueEtFinancière.form';

export type ModifierPropositionTechniqueEtFinancièrePageProps = {
  identifiantProjet: string;
  raccordement: {
    reference: string;
    propositionTechniqueEtFinancière: {
      dateSignature: Iso8601DateTime;
      propositionTechniqueEtFinancièreSignée: string;
    };
  };
};

export const ModifierPropositionTechniqueEtFinancièrePage: FC<
  ModifierPropositionTechniqueEtFinancièrePageProps
> = ({ identifiantProjet, raccordement }: ModifierPropositionTechniqueEtFinancièrePageProps) => {
  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={identifiantProjet} />}
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
