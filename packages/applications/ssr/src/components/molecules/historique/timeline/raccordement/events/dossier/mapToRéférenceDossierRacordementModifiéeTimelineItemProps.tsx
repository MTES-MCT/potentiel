import { match } from 'ts-pattern';

import { Historique } from '@potentiel-domain/historique';
import { Raccordement } from '@potentiel-domain/laureat';
import { DateTime } from '@potentiel-domain/common';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

export const mapToRéférenceDossierRacordementModifiéeTimelineItemProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const event = match(modification)
    .with(
      { type: 'RéférenceDossierRacordementModifiée-V1' },
      (event) => event as unknown as Raccordement.RéférenceDossierRacordementModifiéeEventV1,
    )
    .with(
      { type: 'RéférenceDossierRacordementModifiée-V2' },
      (event) => event as unknown as Raccordement.RéférenceDossierRacordementModifiéeEvent,
    )
    .otherwise(() => undefined);

  if (!event) {
    return mapToÉtapeInconnueOuIgnoréeTimelineItemProps(modification);
  }

  return {
    date:
      event.type === 'RéférenceDossierRacordementModifiée-V2'
        ? event.payload.modifiéeLe
        : (modification.createdAt as DateTime.RawType),
    title: (
      <div>
        La référence pour le dossier de raccordement{' '}
        {event.payload.référenceDossierRaccordementActuelle} a été modifiée par{' '}
        {event.payload.nouvelleRéférenceDossierRaccordement}.{' '}
        {event.type === 'RéférenceDossierRacordementModifiée-V2' &&
          `Cette modification a été réalisé par ${event.payload.modifiéePar}`}
      </div>
    ),
  };
};
