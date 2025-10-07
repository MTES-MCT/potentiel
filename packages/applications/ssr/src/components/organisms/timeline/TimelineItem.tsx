import { ReactNode, FC } from 'react';
import clsx from 'clsx';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import MuiTimelineItem from '@mui/lab/TimelineItem';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { IconProps, Icon } from '@/components/atoms/Icon';
import { FormattedDate } from '@/components/atoms/FormattedDate';

import { ETAPE_INCONNUE_TITLE } from './Timeline';

export type TimelineItemProps = {
  status?: 'error' | 'success' | 'warning' | 'info';
  title: ReactNode;
  type?: string;
  content?: ReactNode;
  date: Iso8601DateTime;
  icon?: IconProps;
  isLast?: true;
};
export const TimelineItem: FC<TimelineItemProps> = ({
  date,
  title,
  content,
  type,
  status,
  icon,
  isLast,
}) => {
  const isÉtapeInconnue = title === ETAPE_INCONNUE_TITLE;

  return (
    <MuiTimelineItem
      sx={{
        minHeight: '50',
      }}
    >
      <TimelineOppositeContent>
        <div className={`font-bold print:pt-0 ${icon && 'pt-3'}`}>
          <FormattedDate date={date} />
        </div>
      </TimelineOppositeContent>
      <TimelineSeparator
        sx={{
          '@media print': {
            display: 'none',
          },
        }}
      >
        <TimelineDot
          color={
            status === 'error' || isÉtapeInconnue
              ? 'error'
              : status === 'success'
                ? 'success'
                : status === 'warning'
                  ? 'warning'
                  : status === 'info'
                    ? 'info'
                    : 'grey'
          }
        >
          {icon && <Icon id={icon.id} size="md" />}
        </TimelineDot>
        {!isLast && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent
        color={isÉtapeInconnue ? 'error' : undefined}
        sx={{
          alignContent: 'flex-start',
        }}
      >
        <div className={clsx('print:pt-0', icon && 'pt-3')}>
          {title}
          {isÉtapeInconnue && type && ` (${type})`}
          {content ? <div className={clsx(title && 'mt-2')}>{content}</div> : null}
        </div>
      </TimelineContent>
    </MuiTimelineItem>
  );
};
