import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

export const mapToGestionnaireRéseauRaccordementModifiéTimelineItemProps = (
  modification: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { identifiantGestionnaireRéseau } =
    modification.payload as Lauréat.Raccordement.GestionnaireRéseauRaccordementModifiéEvent['payload'];
  return {
    date: modification.createdAt as DateTime.RawType,
    title: <div>Nouveau gestionnaire de réseau de raccordement enregistré</div>,
    content: (
      <div>
        Nouveau gestionnaire :{' '}
        <span className="font-semibold">{identifiantGestionnaireRéseau}</span>
      </div>
    ),
  };
};
