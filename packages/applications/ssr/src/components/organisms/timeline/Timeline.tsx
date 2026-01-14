import { FC } from 'react';
import MuiTimeline from '@mui/lab/Timeline';
import { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent';

import { TimelineItem, TimelineItemProps } from './';

export type TimelineProps = {
  items: Array<TimelineItemProps>;
  className?: string;
  ItemComponent?: FC<TimelineItemProps>;
};

export const Timeline: FC<TimelineProps> = ({ items, className, ItemComponent = TimelineItem }) => {
  const filteredItems = items.filter((item) => !item.isÉtapeInconnue);

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
        <ItemComponent
          key={`${item.title}-${item.date}`}
          icon={item.icon}
          details={item.details}
          date={item.date}
          type={item.type}
          status={item.status}
          title={item.title}
          actor={item.actor}
          isLast={index === filteredItems.length - 1 ? true : undefined}
          file={item.file}
          redirect={item.redirect}
        />
      ))}
    </MuiTimeline>
  );
};
