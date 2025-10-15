import { FC } from 'react';

import { Email } from '@potentiel-domain/common';

type TimelineItemUserEmailProps = {
  email: string;
};

export const TimelineItemUserEmail: FC<TimelineItemUserEmailProps> = ({ email }) => {
  if (Email.convertirEnValueType(email).estSystème()) {
    return null;
  }

  return (
    <>
      par <span className="font-semibold">{email}</span>
    </>
  );
};
