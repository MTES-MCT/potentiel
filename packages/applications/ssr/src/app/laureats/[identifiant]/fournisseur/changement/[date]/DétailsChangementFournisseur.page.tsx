import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Heading2 } from '@/components/atoms/headings';
import { Timeline, TimelineItemProps } from '@/components/organisms/timeline';

import {
  DétailsChangementFournisseur,
  DétailsChangementFournisseurProps,
} from './DétailsChangementFournisseur';

export type ChangementFournisseurActions = 'enregistrer-changement';

export type DétailsChangementFournisseurPageProps = DétailsChangementFournisseurProps & {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  historique: Array<TimelineItemProps>;
};

export const DétailsChangementFournisseurPage: FC<DétailsChangementFournisseurPageProps> = ({
  changement,
  technologie,
  évaluationCarboneSimplifiéeInitiale,
  historique,
}) => (
  <>
    <div className="flex flex-col gap-8">
      <DétailsChangementFournisseur
        changement={changement}
        évaluationCarboneSimplifiéeInitiale={évaluationCarboneSimplifiéeInitiale}
        technologie={technologie}
      />
      <div className="mb-4">
        <Heading2>Historique</Heading2>
        <Timeline items={historique} />
      </div>
    </div>
  </>
);
