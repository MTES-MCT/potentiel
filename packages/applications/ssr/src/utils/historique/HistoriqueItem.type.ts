import { TimelineItemProps } from '@/components/organisms/Timeline';

export type HistoriqueItem<TEvent> = (args: {
  event: TEvent;
  withLink?: true;
}) => TimelineItemProps;
