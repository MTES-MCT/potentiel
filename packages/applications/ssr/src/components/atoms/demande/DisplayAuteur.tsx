import { FC } from 'react';

import { Email } from '@potentiel-domain/common';

type DisplayAuteurProps = { email: Email.ValueType };

export const DisplayAuteur: FC<DisplayAuteurProps> = ({ email }) => {
  if (email.estSystème() || email.estInconnu()) {
    return;
  }

  // Cas limite, pour le moment l'API sera utilisé par le co-contractant
  if (email.estClientAPI()) {
    return <> par le co-contractant</>;
  }

  return (
    <>
      {' '}
      par <span className="font-medium">{email.formatter()}</span>
    </>
  );
};
