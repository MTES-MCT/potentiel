import { Email } from '@potentiel-domain/common';
import { EmailDGEC } from '@potentiel-domain/appel-offre';

import { Recipient } from '../sendEmail';

type GetDgecRecipient = (idAppelOffre: string) => Recipient;

export const getDgecRecipient: GetDgecRecipient = (idAppelOffre) => {
  /**
   * Ce check devrait être fait depuis un ValueType, mais le soucis est qu'actuellement
   * on a pas de type strict pour l'identifiant d'appel d'offre
   */
  const ID_AO_EOLIEN = ['Eolien', 'PPE2 - Eolien'];

  if (ID_AO_EOLIEN.includes(idAppelOffre)) {
    return {
      email: Email.convertirEnValueType(EmailDGEC.EmailDgecAoEolien.email).formatter(),
    };
  }

  return {
    email: Email.convertirEnValueType(EmailDGEC.EmailDgecAoPv.email).formatter(),
  };
};
