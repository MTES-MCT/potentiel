import { Email } from '@potentiel-domain/common';

import { Recipient } from '../sendEmail';

type GetDgecRecipient = (idAppelOffre: string) => Recipient;

export const getDgecRecipient: GetDgecRecipient = (idAppelOffre) => {
  /**
   * Ce check devrait être fait depuis un ValueType, mais le soucis est qu'actuellement
   * on a pas de type strict pour l'identifiant d'appel d'offre
   */
  const ID_AO_EOLIEN = ['Eolien', 'PPE2 - Eolien'];

  if (ID_AO_EOLIEN.includes(idAppelOffre)) {
    if (!process.env.DGEC_EMAIL_AO_EOLIEN) {
      throw new Error("La variable d'environnement DGEC_EMAIL_AO_EOLIEN est manquante");
    }

    return {
      email: Email.convertirEnValueType(process.env.DGEC_EMAIL_AO_EOLIEN).formatter(),
    };
  }

  if (!process.env.DGEC_EMAIL_AO_PV) {
    throw new Error("La variable d'environnement DGEC_EMAIL_AO_PV est manquante");
  }

  return {
    email: Email.convertirEnValueType(process.env.DGEC_EMAIL_AO_PV).formatter(),
  };
};
