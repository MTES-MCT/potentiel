import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { PageTemplate } from '@/components/templates/Page.template';
import {
  HistoriqueTimeline,
  HistoriqueTimelineProps,
} from '@/components/molecules/historique/HistoriqueTimeline';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ImprimerPage } from '@/components/atoms/ImprimerPage';
import { ListFilters } from '@/components/molecules/ListFilters';
import { FiltersTagListProps, FiltersTagList } from '@/components/molecules/FiltersTagList';

export type HistoriqueLauréatAction = 'imprimer';

export type HistoriqueLauréatPageProps = {
  identifiantProjet: string;
  unitéPuissance: AppelOffre.ConsulterAppelOffreReadModel['unitePuissance'];
  actions?: Array<HistoriqueLauréatAction>;
  filters: FiltersTagListProps['filters'];
} & HistoriqueTimelineProps;

export const HistoriqueLauréatPage: FC<HistoriqueLauréatPageProps> = ({
  identifiantProjet,
  unitéPuissance,
  actions,
  historique,
  filters,
}) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
    <div className="flex flex-col gap-4">
      {actions?.includes('imprimer') && <ImprimerPage />}
      <Alert
        severity="warning"
        title="Attention"
        description="Les informations à propos des modifications de fournisseur et des demandes de délai ne sont
        pas encore présentes."
      />

      <FiltersTagList filters={filters} />

      <div className="flex flex-row gap-4">
        {filters.length ? <ListFilters filters={filters} /> : null}
        {historique.length > 0 ? (
          <HistoriqueTimeline historique={historique} unitéPuissance={unitéPuissance} />
        ) : (
          <>Aucun élément à afficher</>
        )}
      </div>
    </div>
  </PageTemplate>
);
