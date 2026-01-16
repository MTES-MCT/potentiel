/* eslint-disable react/jsx-props-no-spreading */
import clsx from 'clsx';
import { FC } from 'react';

import { TimelineItemBase } from '@/components/organisms/timeline/TimelineItemBase';
import { TimelineItemProps, TimelineItemFile } from '@/components/organisms/timeline';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { DisplayRaisonChangement } from '@/components/atoms/historique/DisplayRaisonChangement';

export const HistoriqueLauréatTimelineItem: FC<TimelineItemProps> = ({
  details,
  file,
  link,
  reason,
  ...props
}) => {
  return (
    <TimelineItemBase {...props}>
      {details && <div className={clsx(props.title && 'mt-2')}>{details}</div>}
      {reason && !link && <DisplayRaisonChangement raison={reason} />}
      {file && !link && <TimelineItemFile {...file} />}
      {link && (
        <TertiaryLink href={link.url} aria-label={link.ariaLabel} className="mt-2">
          {link.label}
        </TertiaryLink>
      )}
    </TimelineItemBase>
  );
};
