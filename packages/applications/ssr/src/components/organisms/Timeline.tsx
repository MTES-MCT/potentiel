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

export type TimelineProps = {
  items: Array<TimelineItemProps>;
};
export const Timeline: FC<TimelineProps> = ({ items }) => (
  <MuiTimeline
    sx={{
      [`& .${timelineOppositeContentClasses.root}`]: {
        flex: 0.2,
        paddingLeft: 0,
      },
      paddingLeft: 0,
    }}
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
  date: string;
};

const TimelineItem: FC<TimelineItemProps> = ({ status, date, title, content }) => (
  <MuiTimelineItem>
    <TimelineOppositeContent>
      <span className="font-bold">{date}</span>
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
