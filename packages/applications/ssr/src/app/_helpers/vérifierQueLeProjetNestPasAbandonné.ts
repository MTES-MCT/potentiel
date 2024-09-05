import { notFound } from 'next/navigation';

import { StatutProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';

import { récupérerProjet } from './récupérerProjet';

export const vérifierQueLeProjetNestPasAbandonné = async (
  identifiantProjet: string,
  projetStatut?: Candidature.ConsulterProjetReadModel['statut'],
) => {
  const statut = projetStatut ?? (await récupérerProjet(identifiantProjet)).statut;

  if (StatutProjet.convertirEnValueType(statut).estAbandonné()) {
    return notFound();
  }
};
