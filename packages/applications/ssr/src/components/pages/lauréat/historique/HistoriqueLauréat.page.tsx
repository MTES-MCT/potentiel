import { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Timeline, TimelineProps } from '@/components/organisms/Timeline';

export type HistoriqueLauréatPageProps = {
  identifiantProjet: string;
} & TimelineProps;

export const HistoriqueLauréatPage: FC<HistoriqueLauréatPageProps> = ({
  identifiantProjet,
  items,
}) => {
  return (
    <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
      <Timeline items={items} />
    </PageTemplate>
  );
};
