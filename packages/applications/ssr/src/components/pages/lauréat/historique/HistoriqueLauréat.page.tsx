import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

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
      <Alert
        severity="warning"
        title="Attention"
        description="Les informations à propos des modifications de fournisseur et des demandes de délai ne sont
        pas encore présentes."
      />
      <div className="mt-4">
        <HistoriqueTimeline historique={historique} unitéPuissance={unitéPuissance} />
      </div>
    </PageTemplate>
  );
};
