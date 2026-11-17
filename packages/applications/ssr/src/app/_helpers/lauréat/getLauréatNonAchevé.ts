import { notFound } from 'next/navigation';

import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { getLauréatInfos } from '@/app/_helpers';

export const getLauréatNonAchevé = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const projet = await getLauréatInfos(identifiantProjet);

  if (projet.statut.estAchevé()) {
    return notFound();
  }

  return projet;
};
