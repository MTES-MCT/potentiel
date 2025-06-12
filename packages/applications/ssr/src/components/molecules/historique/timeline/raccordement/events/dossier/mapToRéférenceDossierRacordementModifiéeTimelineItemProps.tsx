import { match } from 'ts-pattern';

import { Historique } from '@potentiel-domain/historique';
import { Raccordement } from '@potentiel-domain/laureat';
import { DateTime } from '@potentiel-domain/common';

export const mapToRéférenceDossierRacordementModifiéeTimelineItemProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  return match(modification)
    .with({ type: 'RéférenceDossierRacordementModifiée-V1' }, (event) => {
      const { référenceDossierRaccordementActuelle, nouvelleRéférenceDossierRaccordement } =
        event.payload as Raccordement.RéférenceDossierRacordementModifiéeEventV1['payload'];

      event.payload.identifiantProjet;
      return {
        date: event.createdAt as DateTime.RawType,
        title: (
          <div>
            La référence pour le dossier de raccordement {référenceDossierRaccordementActuelle} a
            été modifiée. Nouvelle référence :{' '}
            <span className="font-semibold">{nouvelleRéférenceDossierRaccordement}</span>
          </div>
        ),
      };
    })
    .with({ type: 'RéférenceDossierRacordementModifiée-V2' }, (event) => {
      const {
        référenceDossierRaccordementActuelle,
        nouvelleRéférenceDossierRaccordement,
        modifiéeLe,
        modifiéePar,
      } = event.payload as Raccordement.RéférenceDossierRacordementModifiéeEvent['payload'];

      return {
        date: modifiéeLe,
        title: (
          <div>
            La référence pour le dossier de raccordement {référenceDossierRaccordementActuelle} a
            été modifiée par {modifiéePar}. Nouvelle référence :{' '}
            <span className="font-semibold">{nouvelleRéférenceDossierRaccordement}</span>
          </div>
        ),
      };
    })
    .otherwise(() => ({
      date: modification.createdAt as DateTime.RawType,
      title: 'Étape de raccordement inconnue',
    }));
};
