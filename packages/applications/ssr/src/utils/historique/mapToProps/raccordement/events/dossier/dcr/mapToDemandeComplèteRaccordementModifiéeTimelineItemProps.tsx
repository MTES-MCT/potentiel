import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';
import { Raccordement } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../../../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

export const mapToDemandeComplèteRaccordementModifiéeTimelineItemProps = (
  modification: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const event = match(modification)
    .with(
      { type: 'DemandeComplèteRaccordementModifiée-V1' },
      (event) => event as unknown as Raccordement.DemandeComplèteRaccordementModifiéeEventV1,
    )
    .with(
      { type: 'DemandeComplèteRaccordementModifiée-V2' },
      (event) => event as unknown as Raccordement.DemandeComplèteRaccordementModifiéeEventV2,
    )
    .with(
      { type: 'DemandeComplèteRaccordementModifiée-V3' },
      (event) => event as unknown as Raccordement.DemandeComplèteRaccordementModifiéeEvent,
    )
    .otherwise(() => undefined);

  if (!event) {
    return mapToÉtapeInconnueOuIgnoréeTimelineItemProps(modification);
  }

  return {
    date: modification.createdAt as DateTime.RawType,
    title: (
      <div>
        Le dossier avec la référence{' '}
        <span className="font-semibold">
          {event.type === 'DemandeComplèteRaccordementModifiée-V1'
            ? event.payload.referenceActuelle
            : event.payload.référenceDossierRaccordement}
        </span>{' '}
        a été modifié
      </div>
    ),
  };
};
