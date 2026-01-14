import { FC, ReactNode } from 'react';
import clsx from 'clsx';
import MuiTimelineItem from '@mui/lab/TimelineItem';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { Icon, IconProps } from '../../atoms/Icon';
import { FormattedDate } from '../../atoms/FormattedDate';

import { TimelineItemTitle, TimelineItemTitleProps } from './TimelineItemTitle';

export type TimelineItemBaseProps = {
  status?: 'error' | 'success' | 'warning' | 'info';
  actor?: TimelineItemTitleProps['actor'];
  type?: string;
  children: ReactNode;
  date: Iso8601DateTime;
  icon?: IconProps;
  isLast?: true;
  title: TimelineItemTitleProps['title'];
  isÉtapeInconnue?: true;
};

export const TimelineItemBase: FC<TimelineItemBaseProps> = ({
  date,
  title,
  actor,
  type,
  status,
  icon,
  isLast,
  isÉtapeInconnue,
  children,
}) => {
  return (
    <MuiTimelineItem
      sx={{
        minHeight: '50',
      }}
    >
      <TimelineOppositeContent>
        <div className={clsx('font-bold', icon && 'pt-3')}>
          <FormattedDate date={date} />
        </div>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot color={mapStatusToDotColor(isÉtapeInconnue ? 'error' : status)}>
          {icon && <Icon id={icon.id} size="md" className="print:text-theme-black" />}
        </TimelineDot>
        {!isLast && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent
        color={isÉtapeInconnue ? 'error' : undefined}
        sx={{ alignContent: 'flex-start' }}
      >
        <div className={clsx(icon && 'pt-3')}>
          {isÉtapeInconnue ? (
            <div>
              {title} ({type})
            </div>
          ) : (
            <TimelineItemTitle title={title} actor={actor} />
          )}
          {children}
        </div>
      </TimelineContent>
    </MuiTimelineItem>
  );
};

const mapStatusToDotColor = (status: TimelineItemBaseProps['status']) => {
  return status === 'error'
    ? 'error'
    : status === 'success'
      ? 'success'
      : status === 'warning'
        ? 'warning'
        : status === 'info'
          ? 'info'
          : 'grey';
};
