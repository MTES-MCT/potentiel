import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Heading2 } from '@/components/atoms/headings';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { PageTemplate } from '@/components/templates/Page.template';
import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';

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
  identifiantProjet,
  changement,
  technologie,
  évaluationCarboneSimplifiéeInitiale,
  historique,
}) => (
  <PageTemplate
    banner={
      <ProjetLauréatBanner
        identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />
    }
  >
    <div className="flex flex-col gap-8">
      <DétailsChangementFournisseur
        changement={changement}
        technologie={technologie}
        évaluationCarboneSimplifiéeInitiale={évaluationCarboneSimplifiéeInitiale}
      />
      <div className="mb-4">
        <Heading2>Historique</Heading2>
        <Timeline items={historique} />
      </div>
    </div>
  </PageTemplate>
);
