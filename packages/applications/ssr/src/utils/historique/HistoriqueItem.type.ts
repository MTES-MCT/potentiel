import { TimelineItemProps } from '@/components/organisms/timeline/TimelineItem';

export type HistoriqueItem<TEvent> = (args: {
  event: TEvent;
  withLink?: true;
}) => TimelineItemProps;
