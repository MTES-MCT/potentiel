import type { FC } from 'react';

import { ImprimerButton } from '@/components/atoms/ImprimerButton';
import { SectionPage } from '@/components/atoms/section/SectionPage';
import { Timeline, type TimelineItemProps } from '@/components/organisms/timeline';
import { CatégorieFilter, type CatégorieFilterProps } from './CatégorieFilter';
import { HistoriqueLauréatTimelineItem } from './HistoriqueLauréatTimelineItem';

export type HistoriqueLauréatAction = 'imprimer';

export type HistoriqueLauréatPageProps = {
  identifiantProjet: string;
  actions?: Array<HistoriqueLauréatAction>;
  historique: Array<TimelineItemProps>;
} & CatégorieFilterProps;

export const HistoriqueLauréatPage: FC<HistoriqueLauréatPageProps> = ({
  actions,
  historique,
  catégories,
}) => (
  <SectionPage title="Historique du projet">
    <div className="flex flex-col gap-6 w-full">
      <div className="flex lg:flex-row flex-col gap-4 w-full">
        <div className="print:hidden flex flex-col gap-1 w-max">
          <div className="flex flex-row gap-5 flex-1 w-full">
            <CatégorieFilter catégories={catégories} />
          </div>
        </div>
        {actions?.includes('imprimer') && <ImprimerButton />}
      </div>
      <div className="flex flex-row gap-2">
        {historique.length > 0 ? (
          <Timeline items={historique} ItemComponent={HistoriqueLauréatTimelineItem} />
        ) : (
          <div className="w-full flex justify-center mt-4">
            <span>Aucun élément à afficher</span>
          </div>
        )}
      </div>
    </div>
  </SectionPage>
);
