/* eslint-disable react/jsx-props-no-spreading */
import Button from '@codegouvfr/react-dsfr/Button';
import clsx from 'clsx';
import { FC } from 'react';

import { TimelineItemBase } from '@/components/organisms/timeline/TimelineItemBase';
import { TimelineItemProps, TimelineItemFile } from '@/components/organisms/timeline';

export const HistoriqueLauréatTimelineItem: FC<TimelineItemProps> = ({
  details,
  file,
  redirect,
  ...props
}) => {
  return (
    <TimelineItemBase {...props}>
      {details ? <div className={clsx(props.title && 'mt-2')}>{details}</div> : null}
      {file && <TimelineItemFile {...file} />}
      {redirect ? (
        <Button
          priority="secondary"
          linkProps={{
            href: redirect.url,
          }}
          aria-label={redirect.ariaLabel}
          className="mt-2"
        >
          {redirect.label}
        </Button>
      ) : null}
    </TimelineItemBase>
  );
};
