import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

export const mapToGestionnaireRéseauAttribuéTimelineItemProps = (
  attribution: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { identifiantGestionnaireRéseau } =
    attribution.payload as Lauréat.Raccordement.GestionnaireRéseauAttribuéEvent['payload'];

  return {
    date: attribution.createdAt as DateTime.RawType,
    title: (
      <div>Un gestionnaire de réseau de raccordement a été attribué au raccordement du projet</div>
    ),
    content: (
      <div>
        Gestionnaire attribué :{' '}
        <span className="font-semibold">{identifiantGestionnaireRéseau}</span>
      </div>
    ),
  };
};
