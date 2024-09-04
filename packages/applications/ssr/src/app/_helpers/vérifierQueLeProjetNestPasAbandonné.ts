import { notFound } from 'next/navigation';

import { StatutProjet } from '@potentiel-domain/common';

import { récupérerProjet } from './récupérerProjet';

export const vérifierQueLeProjetNestPasAbandonné = async (identifiantProjet: string) => {
  const projet = await récupérerProjet(identifiantProjet);

  if (StatutProjet.convertirEnValueType(projet.statut).estAbandonné()) {
    return notFound();
  }
};
