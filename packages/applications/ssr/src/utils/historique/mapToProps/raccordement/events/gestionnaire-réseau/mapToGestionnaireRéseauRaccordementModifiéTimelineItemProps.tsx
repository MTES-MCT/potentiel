import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { Raccordement } from '@potentiel-domain/laureat';

import { MapToRaccordementTimelineItemProps } from '../../mapToRaccordementTimelineItemProps';

export const mapToGestionnaireRéseauRaccordementModifiéTimelineItemProps: MapToRaccordementTimelineItemProps =
  (modification, icon) => {
    const { identifiantGestionnaireRéseau } =
      modification.payload as Raccordement.GestionnaireRéseauRaccordementModifiéEvent['payload'];

    return {
      date: modification.createdAt as DateTime.RawType,
      icon,
      title: <div>Le gestionnaire de réseau de raccordement du projet a été modifié</div>,
      content: (
        <Link href={Routes.Gestionnaire.détail(identifiantGestionnaireRéseau)}>
          Voir le nouveau gestionnaire
        </Link>
      ),
    };
  };
