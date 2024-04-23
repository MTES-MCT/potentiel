import React, { FC, ReactNode } from 'react';
import MuiTimeline from '@mui/lab/Timeline';
import MuiTimelineItem from '@mui/lab/TimelineItem';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';

import { Iso8601DateTime, formatDate } from '@/utils/formatDate';

export type TimelineProps = {
  items: Array<TimelineItemProps>;
  className?: string;
};
export const Timeline: FC<TimelineProps> = ({ items, className }) => (
  <MuiTimeline
    sx={{
      [`& .${timelineOppositeContentClasses.root}`]: {
        flex: 0.2,
        paddingLeft: 0,
      },
      paddingLeft: 0,
    }}
    className={className ?? ''}
  >
    {items.map((item, index) => (
      <TimelineItem key={index} {...item} />
    ))}
  </MuiTimeline>
);

export type TimelineItemProps = {
  status?: 'error' | 'success' | 'warning' | 'info';
  title: ReactNode;
  content?: ReactNode;
  date: Iso8601DateTime | 'En attente';
};

const TimelineItem: FC<TimelineItemProps> = ({ status, date, title, content }) => (
  <MuiTimelineItem>
    <TimelineOppositeContent className="w-">
      <span className="font-bold">
        {date === 'En attente' ? date : formatDate(date, 'dd/MM/yyyy')}
      </span>
    </TimelineOppositeContent>
    <TimelineSeparator>
      <TimelineDot
        color={
          status === 'error'
            ? 'error'
            : status === 'success'
            ? 'success'
            : status === 'warning'
            ? 'warning'
            : status === 'info'
            ? 'info'
            : 'grey'
        }
      />
      <TimelineConnector />
    </TimelineSeparator>
    <TimelineContent>
      <>
        {title}
        {content ? <div className="mt-2">{content}</div> : null}
      </>
    </TimelineContent>
  </MuiTimelineItem>
);
