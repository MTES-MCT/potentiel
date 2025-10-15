import { FC } from 'react';
import MuiTimeline from '@mui/lab/Timeline';
import { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent';

import { ETAPE_INCONNUE_TITLE, TimelineItem, TimelineItemProps } from './TimelineItem';

export type TimelineProps = {
  items: Array<TimelineItemProps>;
  className?: string;
};

export const Timeline: FC<TimelineProps> = ({ items, className }) => {
  const filteredItems = items.filter((item) => item.title !== ETAPE_INCONNUE_TITLE);

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
