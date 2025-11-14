import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Recipient } from '@/sendEmail';

import { getAppelOffre } from "./getAppelOffre.js";

export const listerDgecRecipients = async ({
  appelOffre,
}: IdentifiantProjet.ValueType): Promise<Recipient[]> => {
  const ao = await getAppelOffre(appelOffre);

  return [{ email: ao.dossierSuiviPar }];
};
