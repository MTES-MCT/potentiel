import { notFound } from 'next/navigation';

import { StatutProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';

export const vérifierQueLeProjetNestPasAbandonné = async (
  statut: Candidature.ConsulterProjetReadModel['statut'],
) => {
  if (StatutProjet.convertirEnValueType(statut).estAbandonné()) {
    return notFound();
  }
};
