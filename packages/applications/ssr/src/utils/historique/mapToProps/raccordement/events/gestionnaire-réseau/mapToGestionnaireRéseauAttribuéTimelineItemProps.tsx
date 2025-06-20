import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { Raccordement } from '@potentiel-domain/projet';

export const mapToGestionnaireRéseauAttribuéTimelineItemProps = (
  attribution: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { identifiantGestionnaireRéseau } =
    attribution.payload as Raccordement.GestionnaireRéseauAttribuéEvent['payload'];

  return {
    date: attribution.createdAt as DateTime.RawType,
    title: (
      <div>Un gestionnaire de réseau de raccordement a été attribué au raccordement du projet</div>
    ),
    content: (
      <Link href={Routes.Gestionnaire.détail(identifiantGestionnaireRéseau)}>
        Voir le gestionnaire
      </Link>
    ),
  };
};
