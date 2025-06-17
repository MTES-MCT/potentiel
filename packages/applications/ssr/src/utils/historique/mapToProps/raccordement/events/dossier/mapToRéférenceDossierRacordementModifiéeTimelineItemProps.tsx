import { match } from 'ts-pattern';

import { Raccordement } from '@potentiel-domain/laureat';
import { DateTime } from '@potentiel-domain/common';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';
import { MapToRaccordementTimelineItemProps } from '../../mapToRaccordementTimelineItemProps';

export const mapToRéférenceDossierRacordementModifiéeTimelineItemProps: MapToRaccordementTimelineItemProps =
  (modification, icon) => {
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
      icon,
      title: (
        <div>
          La référence pour le dossier de raccordement{' '}
          <span className="font-semibold">
            {event.payload.référenceDossierRaccordementActuelle}
          </span>{' '}
          a été changée
          {event.type === 'RéférenceDossierRacordementModifiée-V2' &&
            ` par ${event.payload.modifiéePar}`}
          .
        </div>
      ),
      content: (
        <div>
          Nouvelle référence :{' '}
          <span className="font-semibold">
            {event.payload.nouvelleRéférenceDossierRaccordement}
          </span>
        </div>
      ),
    };
  };
