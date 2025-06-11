import { FC } from 'react';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { PageTemplate } from '@/components/templates/Page.template';
import {
  HistoriqueTimeline,
  HistoriqueTimelineProps,
} from '@/components/molecules/historique/HistoriqueTimeline';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';

export type HistoriqueLauréatPageProps = {
  identifiantProjet: string;
  unitéPuissance: AppelOffre.ConsulterAppelOffreReadModel['unitePuissance'];
} & HistoriqueTimelineProps;

export const HistoriqueLauréatPage: FC<HistoriqueLauréatPageProps> = ({
  identifiantProjet,
  unitéPuissance,
  historique,
}) => {
  return (
    <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
      <HistoriqueTimeline historique={historique} unitéPuissance={unitéPuissance} />
    </PageTemplate>
  );
};
