import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { Historique } from '@potentiel-domain/historique';
import { Raccordement } from '@potentiel-domain/projet';

export const mapToGestionnaireRéseauRaccordementModifiéTimelineItemProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { identifiantGestionnaireRéseau } =
    modification.payload as Raccordement.GestionnaireRéseauRaccordementModifiéEvent['payload'];

  return {
    date: modification.createdAt as DateTime.RawType,
    title: <div>Le gestionnaire de réseau de raccordement du projet a été modifié</div>,
    content: (
      <Link href={Routes.Gestionnaire.détail(identifiantGestionnaireRéseau)}>
        Voir le nouveau gestionnaire
      </Link>
    ),
  };
};
