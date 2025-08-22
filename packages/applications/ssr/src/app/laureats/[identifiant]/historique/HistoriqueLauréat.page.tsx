import type { FC } from 'react';

import { ImprimerPage } from '@/components/atoms/ImprimerPage';
import { FiltersTagList, type FiltersTagListProps } from '@/components/molecules/FiltersTagList';
import { ListFilters } from '@/components/molecules/ListFilters';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Timeline, type TimelineItemProps } from '@/components/organisms/Timeline';
import { PageTemplate } from '@/components/templates/Page.template';

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
