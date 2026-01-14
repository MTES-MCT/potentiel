/* eslint-disable react/jsx-props-no-spreading */
import clsx from 'clsx';
import { FC } from 'react';

import { TimelineItemBase } from '@/components/organisms/timeline/TimelineItemBase';
import { TimelineItemProps, TimelineItemFile } from '@/components/organisms/timeline';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

export const HistoriqueLauréatTimelineItem: FC<TimelineItemProps> = ({
  details,
  file,
  redirect,
  ...props
}) => {
  return (
    <TimelineItemBase {...props}>
      {details && <div className={clsx(props.title && 'mt-2')}>{details}</div>}
      {file && <TimelineItemFile {...file} />}
      {redirect && (
        <TertiaryLink href={redirect.url} aria-label={redirect.ariaLabel} className="mt-2">
          {redirect.label}
        </TertiaryLink>
      )}
    </TimelineItemBase>
  );
};
