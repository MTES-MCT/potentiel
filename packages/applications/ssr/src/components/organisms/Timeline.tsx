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

import { Icon, IconProps } from '../atoms/Icon';
import { FormattedDate } from '../atoms/FormattedDate';

export type TimelineProps = {
  items: Array<TimelineItemProps>;
  className?: string;
};
export const Timeline: FC<TimelineProps> = ({ items, className }) => {
  const filteredItems = items.filter((item) => {
    if (item.title !== 'Étape inconnue') {
      return true;
    }
    return process.env.APPLICATION_STAGE !== 'production';
  });

  return (
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
      {filteredItems.map((item, index) => (
        <TimelineItem
          key={`${item.title}-${item.date}`}
          icon={item.icon}
          content={item.content}
          date={item.date}
          type={item.type}
          status={item.status}
          title={item.title}
          isLast={index === filteredItems.length - 1 ? true : undefined}
        />
      ))}
    </MuiTimeline>
  );
};

export type TimelineItemProps = {
  status?: 'error' | 'success' | 'warning' | 'info';
  title: ReactNode;
  type?: string;
  content?: ReactNode;
  date: Iso8601DateTime;
  icon?: IconProps;
  isLast?: true;
};
const TimelineItem: FC<TimelineItemProps> = ({
  date,
  title,
  content,
  type,
  status,
  icon,
  isLast,
}) => {
  const isÉtapeInconnue = title === 'Étape inconnue';
  return (
    <MuiTimelineItem
      sx={{
        minHeight: '50',
      }}
    >
      <TimelineOppositeContent>
        <div className="font-bold pt-3 print:pt-0">
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
          '@media print': {
            alignContent: 'flex-start',
          },
          '@media screen': {
            alignContent: 'center',
          },
        }}
      >
        <>
          {title}
          {isÉtapeInconnue && type && ` (${type})`}
          {content ? <div className="mt-2">{content}</div> : null}
        </>
      </TimelineContent>
    </MuiTimelineItem>
  );
};
