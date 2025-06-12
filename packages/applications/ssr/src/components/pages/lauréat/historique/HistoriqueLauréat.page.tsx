import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Button from '@codegouvfr/react-dsfr/Button';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { PageTemplate } from '@/components/templates/Page.template';
import {
  HistoriqueTimeline,
  HistoriqueTimelineProps,
} from '@/components/molecules/historique/HistoriqueTimeline';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';

export type HistoriqueLauréatAction = 'imprimer';

export type HistoriqueLauréatPageProps = {
  identifiantProjet: string;
  unitéPuissance: AppelOffre.ConsulterAppelOffreReadModel['unitePuissance'];
  actions?: Array<HistoriqueLauréatAction>;
} & HistoriqueTimelineProps;

export const HistoriqueLauréatPage: FC<HistoriqueLauréatPageProps> = ({
  identifiantProjet,
  unitéPuissance,
  actions,
  historique,
}) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
    <Alert
      severity="warning"
      title="Attention"
      description="Les informations à propos des modifications de fournisseur et des demandes de délai ne sont
      pas encore présentes."
    />
    <div className="mt-4">
      {actions?.includes('imprimer') && (
        <Button
          priority="primary"
          iconId="fr-icon-printer-line"
          onClick={(event) => {
            event.preventDefault();
            window.print();
          }}
        >
          Imprimer la page
        </Button>
      )}

      <HistoriqueTimeline historique={historique} unitéPuissance={unitéPuissance} />
    </div>
  </PageTemplate>
);
