import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

export const mapToGestionnaireRéseauAttribuéTimelineItemProps = (
  attribution: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  return {
    date: attribution.createdAt as DateTime.RawType,
    title: (
      <div>Un gestionnaire de réseau de raccordement a été attribué au raccordement du projet</div>
    ),
  };
};
