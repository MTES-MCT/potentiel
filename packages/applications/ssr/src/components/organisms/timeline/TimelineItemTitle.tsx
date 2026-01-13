import { FC, ReactNode } from 'react';

import { Email } from '@potentiel-domain/common';

export type TimelineItemTitleProps = {
  title: ReactNode;
  actor?: Email.RawType;
};

export const TimelineItemTitle: FC<TimelineItemTitleProps> = ({ actor, title }) => {
  if (
    !actor ||
    Email.convertirEnValueType(actor).estSystème() ||
    Email.convertirEnValueType(actor).estInconnu()
  ) {
    return <div>{title}</div>;
  }

  return (
    <div>
      {title} par <span className="font-semibold">{actor}</span>
    </div>
  );
};
