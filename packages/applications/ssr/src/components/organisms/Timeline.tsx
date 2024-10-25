import { FC, ReactNode } from 'react';
import MuiTimeline from '@mui/lab/Timeline';
import MuiTimelineItem from '@mui/lab/TimelineItem';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { FormattedDate } from '../atoms/FormattedDate';

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
      '& .MuiTimelineItem-root:before': {
        display: 'none',
      },
      paddingLeft: 0,
    }}
    className={className ?? ''}
  >
    {items.map((item, index) => (
      <TimelineItem
        key={index}
        content={item.content}
        date={item.date}
        status={item.status}
        title={item.title}
      />
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
        {date === 'En attente' ? date : <FormattedDate date={date} />}
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
