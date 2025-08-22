import type { IdentifiantProjet } from '@potentiel-domain/projet';

import type { Recipient } from '../sendEmail';
import { getAppelOffre } from './getAppelOffre';

export const listerDgecRecipients = async ({
  appelOffre,
}: IdentifiantProjet.ValueType): Promise<Recipient[]> => {
  const ao = await getAppelOffre(appelOffre);

  return [{ email: ao.dossierSuiviPar }];
};
