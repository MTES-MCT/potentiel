import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { Heading2 } from '@/components/atoms/headings';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { PageTemplate } from '@/components/templates/Page.template';

import { HistoriqueFournisseurTimeline, HistoriqueFournisseurTimelineProps } from './timeline';
import { DétailsChangementFournisseur } from './DétailsChangementFournisseur';

export type ChangementFournisseurActions = 'enregistrer-changement';

export type DétailsFournisseurPageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  changement: PlainType<Lauréat.Fournisseur.ConsulterChangementFournisseurReadModel['changement']>;
  historique: HistoriqueFournisseurTimelineProps['historique'];
};

export const DétailsFournisseurPage: FC<DétailsFournisseurPageProps> = ({
  identifiantProjet,
  changement,
  historique,
}) => (
  <PageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
  >
    <div className="flex flex-col gap-8">
      <DétailsChangementFournisseur changement={changement} />
      <div className="mb-4">
        <Heading2>Historique</Heading2>
        <HistoriqueFournisseurTimeline historique={historique} />
      </div>
    </div>
  </PageTemplate>
);
