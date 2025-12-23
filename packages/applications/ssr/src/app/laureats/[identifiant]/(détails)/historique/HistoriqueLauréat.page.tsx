import { FC } from 'react';

import { ListFilters } from '@/components/molecules/ListFilters';
import { FiltersTagListProps } from '@/components/molecules/FiltersTagList';
import { Timeline, TimelineItemProps } from '@/components/organisms/timeline';
import { ImprimerButton } from '@/components/atoms/ImprimerButton';

import { SectionPage } from '../(components)/SectionPage';

export type HistoriqueLauréatAction = 'imprimer';

export type HistoriqueLauréatPageProps = {
  identifiantProjet: string;
  actions?: Array<HistoriqueLauréatAction>;
  filters: FiltersTagListProps['filters'];
  historique: Array<TimelineItemProps>;
};

export const HistoriqueLauréatPage: FC<HistoriqueLauréatPageProps> = ({
  actions,
  historique,
  filters,
}) => (
  <SectionPage title="Historique du projet">
    <div className="flex flex-col gap-6 w-full">
      <div className="flex lg:flex-row flex-col gap-4 w-full">
        {filters.length ? (
          <div className="print:hidden flex flex-col gap-1 w-max">
            <ListFilters filters={filters} />
          </div>
        ) : null}
        {actions?.includes('imprimer') && <ImprimerButton />}
      </div>
      <div className="flex flex-row gap-2">
        {historique.length > 0 ? (
          <Timeline items={historique} />
        ) : (
          <div className="w-full flex justify-center mt-4">
            <span>Aucun élément à afficher</span>
          </div>
        )}
      </div>
    </div>
  </SectionPage>
);
