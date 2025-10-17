import { FC, ReactNode } from 'react';

import { Email } from '@potentiel-domain/common';

export type TimelineItemTitleProps = {
  title: ReactNode;
  acteur?: Email.RawType;
};

export const TimelineItemTitle: FC<TimelineItemTitleProps> = ({ acteur, title }) => {
  if (!acteur || Email.convertirEnValueType(acteur).estSystème()) {
    return <div>{title}</div>;
  }

  return (
    <div>
      {title} par <span className="font-semibold">{acteur}</span>
    </div>
  );
};
