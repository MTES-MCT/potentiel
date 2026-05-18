import type { FC } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import type { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { Heading2 } from '@/components/atoms/headings';
import { Timeline, type TimelineItemProps } from '@/components/organisms/timeline';
import { DétailsChangementProducteur } from './DétailsChangementProducteur';

export type ChangementProducteurActions = 'enregistrer-changement';

export type DétailsProducteurPageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  changement: PlainType<Lauréat.Producteur.ConsulterChangementProducteurReadModel['changement']>;
  historique: Array<TimelineItemProps>;
};

export const DétailsProducteurPage: FC<DétailsProducteurPageProps> = ({
  changement,
  historique,
}) => (
  <>
    <div className="flex flex-col gap-8">
      <DétailsChangementProducteur changement={changement} />
      <div className="mb-4">
        <Heading2>Historique</Heading2>
        <Timeline items={historique} />
      </div>
    </div>
  </>
);
