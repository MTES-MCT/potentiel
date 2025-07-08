import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

export const mapToRéférenceDossierRacordementModifiéeTimelineItemProps = (
  modification: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const event = match(modification)
    .with({ type: 'RéférenceDossierRacordementModifiée-V1' }, (event) => event)
    .with({ type: 'RéférenceDossierRacordementModifiée-V2' }, (event) => event)
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
        <span className="font-semibold">{event.payload.référenceDossierRaccordementActuelle}</span>{' '}
        a été changée
        {event.type === 'RéférenceDossierRacordementModifiée-V2' &&
          ` par ${event.payload.modifiéePar}`}
      </div>
    ),
    content: (
      <div>
        Nouvelle référence :{' '}
        <span className="font-semibold">{event.payload.nouvelleRéférenceDossierRaccordement}</span>
      </div>
    ),
  };
};
