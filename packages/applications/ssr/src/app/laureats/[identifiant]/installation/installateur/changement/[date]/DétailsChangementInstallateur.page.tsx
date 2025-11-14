import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { Heading2 } from '@/components/atoms/headings';
import { Timeline, TimelineItemProps } from '@/components/organisms/timeline';

import { DétailsChangementInstallateur } from './DétailsChangementInstallateur';

export type DétailsChangementInstallateurPageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  changement: PlainType<
    Lauréat.Installation.ConsulterChangementInstallateurReadModel['changement']
  >;
  historique: Array<TimelineItemProps>;
};

export const DétailsChangementInstallateurPage: FC<DétailsChangementInstallateurPageProps> = ({
  changement,
  historique,
}) => (
  <>
    <div className="flex flex-col gap-8">
      <DétailsChangementInstallateur changement={changement} />
      <div className="mb-4">
        <Heading2>Historique</Heading2>
        <Timeline items={historique} />
      </div>
    </div>
  </>
);
