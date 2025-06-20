import { DateTime } from '@potentiel-domain/common';
import { Historique } from '@potentiel-domain/historique';

export const mapToGestionnaireRéseauAttribuéTimelineItemProps = (
  attribution: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  return {
    date: attribution.createdAt as DateTime.RawType,
    title: (
      <div>Un gestionnaire de réseau de raccordement a été attribué au raccordement du projet</div>
    ),
  };
};
