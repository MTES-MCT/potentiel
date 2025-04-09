import { Email } from '@potentiel-domain/common';

import { Recipient } from '../sendEmail';

type GetDgecRecipient = () => Recipient;

export const getDgecRecipient: GetDgecRecipient = () => {
  if (!process.env.DGEC_EMAIL) {
    throw new Error("La variable d'environnement DGEC_EMAIL est manquante");
  }

  return {
    email: Email.convertirEnValueType(process.env.DGEC_EMAIL).formatter(),
  };
};
