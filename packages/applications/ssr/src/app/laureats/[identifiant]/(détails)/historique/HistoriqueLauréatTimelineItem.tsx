import clsx from 'clsx';
import type { FC } from 'react';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { DisplayRaisonChangement } from '@/components/atoms/historique/DisplayRaisonChangement';
import { TimelineItemFile, type TimelineItemProps } from '@/components/organisms/timeline';
import { TimelineItemBase } from '@/components/organisms/timeline/TimelineItemBase';

export const HistoriqueLauréatTimelineItem: FC<TimelineItemProps> = ({
  details,
  file,
  link,
  reason,
  ...props
}) => (
  <TimelineItemBase {...props}>
    {details && <div className={clsx(props.title && 'mt-2')}>{details}</div>}
    {reason && !link && <DisplayRaisonChangement raison={reason} />}
    {file && !link && <TimelineItemFile {...file} />}
    {link && (
      <TertiaryLink href={link.url} aria-label={link.ariaLabel} className="mt-2 font-normal">
        {link.label}
      </TertiaryLink>
    )}
  </TimelineItemBase>
);
