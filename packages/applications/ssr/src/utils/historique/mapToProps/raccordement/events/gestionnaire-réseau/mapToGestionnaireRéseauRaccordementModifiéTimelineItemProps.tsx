import type { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

export const mapToGestionnaireRéseauRaccordementModifiéTimelineItemProps = (
  modification: Lauréat.Raccordement.GestionnaireRéseauRaccordementModifiéEvent & {
    createdAt: string;
  },
) => {
  return {
    date: modification.createdAt as DateTime.RawType,
    title: <div>Nouveau gestionnaire de réseau de raccordement enregistré</div>,
  };
};
