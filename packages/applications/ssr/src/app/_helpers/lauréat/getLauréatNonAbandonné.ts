import { notFound } from 'next/navigation';

import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { getLauréatInfos } from './getLauréatInfos';

export const getLauréatNonAbandonné = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const projet = await getLauréatInfos(identifiantProjet);

  if (projet.statut.estAbandonné()) {
    return notFound();
  }

  return projet;
};
