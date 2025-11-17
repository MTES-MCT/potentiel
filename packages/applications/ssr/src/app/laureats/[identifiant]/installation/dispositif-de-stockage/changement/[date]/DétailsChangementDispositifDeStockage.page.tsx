import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { Heading2 } from '@/components/atoms/headings';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { PageTemplate } from '@/components/templates/Page.template';
import { Timeline, TimelineItemProps } from '@/components/organisms/timeline';

import { DétailsChangementDispositifDeStockage } from './DétailsChangementDispositifDeStockage';

export type ChangementDispositifDeStockageActions = 'enregistrer-changement';

export type DétailsChangementDispositifDeStockagePageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  changement: PlainType<
    Lauréat.Installation.ConsulterChangementDispositifDeStockageReadModel['changement']
  >;
  historique: Array<TimelineItemProps>;
};

export const DétailsChangementDispositifDeStockagePage: FC<
  DétailsChangementDispositifDeStockagePageProps
> = ({ identifiantProjet, changement, historique }) => (
  <PageTemplate
    banner={
      <ProjetLauréatBanner
        identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />
    }
  >
    <div className="flex flex-col gap-8">
      <DétailsChangementDispositifDeStockage changement={changement} />
      <div className="mb-4">
        <Heading2>Historique</Heading2>
        <Timeline items={historique} />
      </div>
    </div>
  </PageTemplate>
);
