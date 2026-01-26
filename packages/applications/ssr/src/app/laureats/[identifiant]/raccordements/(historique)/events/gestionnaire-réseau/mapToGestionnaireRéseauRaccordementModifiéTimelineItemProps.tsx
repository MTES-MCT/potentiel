import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToGestionnaireRéseauRaccordementModifiéTimelineItemProps = (
  event: (
    | Lauréat.Raccordement.GestionnaireRéseauRaccordementModifiéEvent
    | Lauréat.Raccordement.GestionnaireRéseauRaccordementModifiéEventV1
  ) & {
    createdAt: string;
  },
): TimelineItemProps => {
  const modifiéLe: DateTime.RawType =
    event.type === 'GestionnaireRéseauRaccordementModifié-V2'
      ? event.payload.modifiéLe
      : DateTime.convertirEnValueType(event.createdAt).formatter();

  const modifiéPar: string | undefined =
    event.type === 'GestionnaireRéseauRaccordementModifié-V2'
      ? event.payload.modifiéPar
      : undefined;

  return {
    date: modifiéLe,
    actor: modifiéPar,
    title: 'Gestionnaire de réseau de raccordement modifié',
  };
};
