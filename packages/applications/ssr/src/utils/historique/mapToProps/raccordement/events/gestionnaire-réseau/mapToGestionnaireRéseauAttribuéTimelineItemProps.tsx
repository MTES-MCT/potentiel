import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { Raccordement } from '@potentiel-domain/laureat';

import { MapToRaccordementTimelineItemProps } from '../../mapToRaccordementTimelineItemProps';

export const mapToGestionnaireRéseauAttribuéTimelineItemProps: MapToRaccordementTimelineItemProps =
  (attribution, icon) => {
    const { identifiantGestionnaireRéseau } =
      attribution.payload as Raccordement.GestionnaireRéseauAttribuéEvent['payload'];

    return {
      date: attribution.createdAt as DateTime.RawType,
      icon,
      title: (
        <div>
          Un gestionnaire de réseau de raccordement a été attribué au raccordement du projet
        </div>
      ),
      content: (
        <Link href={Routes.Gestionnaire.détail(identifiantGestionnaireRéseau)}>
          Voir le gestionnaire
        </Link>
      ),
    };
  };
