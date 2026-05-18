import type { FC } from 'react';

import type { Email } from '@potentiel-domain/common';

type DisplayAuteurProps = { email: Email.ValueType };

export const DisplayAuteur: FC<DisplayAuteurProps> = ({ email }) => {
  if (email.estSystème() || email.estInconnu()) {
    return;
  }

  return (
    <>
      {' '}
      par <span className="font-medium">{email.formatter()}</span>
    </>
  );
};
