import { DateTime } from '@potentiel-domain/common';
import { Historique } from '@potentiel-domain/historique';

export const mapToGestionnaireRéseauRaccordementModifiéTimelineItemProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  return {
    date: modification.createdAt as DateTime.RawType,
    title: <div>Nouveau gestionnaire de réseau de raccordement enregistré</div>,
  };
};
