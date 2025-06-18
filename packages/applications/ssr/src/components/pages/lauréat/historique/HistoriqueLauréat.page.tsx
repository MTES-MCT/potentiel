import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ImprimerPage } from '@/components/atoms/ImprimerPage';
import { ListFilters } from '@/components/molecules/ListFilters';
import { FiltersTagListProps, FiltersTagList } from '@/components/molecules/FiltersTagList';
import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';

export type HistoriqueLauréatAction = 'imprimer';

export type HistoriqueLauréatPageProps = {
  identifiantProjet: string;
  actions?: Array<HistoriqueLauréatAction>;
  filters: FiltersTagListProps['filters'];
  historique: Array<TimelineItemProps>;
};

export const HistoriqueLauréatPage: FC<HistoriqueLauréatPageProps> = ({
  identifiantProjet,
  actions,
  historique,
  filters,
}) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
    <div className="flex flex-col gap-6">
      <Alert
        className="print:hidden"
        severity="warning"
        title="Attention"
        description="Les informations relatives aux demandes de délai ne sont
        pas encore intégrées."
      />

      <div className="flex print:hidden">
        <FiltersTagList filters={filters} />
        {actions?.includes('imprimer') && <ImprimerPage />}
      </div>

      <div className="flex flex-row gap-4">
        {filters.length ? (
          <div className="print:hidden">
            <ListFilters filters={filters} />
          </div>
        ) : null}
        {historique.length > 0 ? <Timeline items={historique} /> : <>Aucun élément à afficher</>}
      </div>
    </div>
  </PageTemplate>
);
