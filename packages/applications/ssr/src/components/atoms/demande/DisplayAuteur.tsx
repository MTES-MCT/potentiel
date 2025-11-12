import { FC } from 'react';

import { Email } from '@potentiel-domain/common';

type DisplayAuteurProps = { email: Email.ValueType };

export const DisplayAuteur: FC<DisplayAuteurProps> = ({ email }) => {
  if (email.estSystème()) {
    return;
  }

  return (
    <>
      {' '}
      par <span className="font-medium">{email.formatter()}</span>
    </>
  );
};
