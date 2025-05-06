import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Producteur } from '@potentiel-domain/laureat';

import { Heading2 } from '@/components/atoms/headings';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import {
  HistoriqueProducteurTimeline,
  HistoriqueProducteurTimelineProps,
} from '@/components/pages/producteur/changement/détails/timeline';
import { PageTemplate } from '@/components/templates/Page.template';

import { DétailsChangementProducteur } from './DétailsChangementProducteur';

export type ChangementProducteurActions = 'enregistrer-changement';

export type DétailsProducteurPageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  changement: PlainType<Producteur.ConsulterChangementProducteurReadModel['changement']>;
  historique: HistoriqueProducteurTimelineProps['historique'];
};

export const DétailsProducteurPage: FC<DétailsProducteurPageProps> = ({
  identifiantProjet,
  changement,
  historique,
}) => (
  <PageTemplate>
    banner=
    {<ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />}
    <div className="flex flex-col gap-8">
      <DétailsChangementProducteur changement={changement} />
      <div className="mb-4">
        <Heading2>Historique</Heading2>
        <HistoriqueProducteurTimeline historique={historique} />
      </div>
    </div>
  </PageTemplate>
);
