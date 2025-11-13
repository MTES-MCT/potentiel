import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { Heading2 } from '@/components/atoms/headings';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { PageTemplate } from '@/components/templates/Page.template';
import { Timeline, TimelineItemProps } from '@/components/organisms/timeline';

import { DétailsChangementNomProjet } from './DétailsChangementNomProjet';

export type ChangementNomProjetActions = 'enregistrer-changement';

export type DétailsNomProjetPageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  changement: PlainType<Lauréat.ConsulterChangementNomProjetReadModel['changement']>;
  historique: Array<TimelineItemProps>;
};

export const DétailsNomProjetPage: FC<DétailsNomProjetPageProps> = ({
  identifiantProjet,
  changement,
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
      <DétailsChangementNomProjet changement={changement} />
      <div className="mb-4">
        <Heading2>Historique</Heading2>
        <Timeline items={historique} />
      </div>
    </div>
  </PageTemplate>
);
