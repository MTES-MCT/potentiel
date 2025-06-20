import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';
import { Raccordement } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../../../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

export const mapToDemandeComplèteDeRaccordementTransmiseTimelineItemProps = (
  modification: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const event = match(modification)
    .with(
      { type: 'DemandeComplèteDeRaccordementTransmise-V1' },
      (event) => event as unknown as Raccordement.DemandeComplèteRaccordementTransmiseEventV1,
    )
    .with(
      { type: 'DemandeComplèteDeRaccordementTransmise-V2' },
      (event) => event as unknown as Raccordement.DemandeComplèteRaccordementTransmiseEventV2,
    )
    .with(
      { type: 'DemandeComplèteDeRaccordementTransmise-V3' },
      (event) => event as unknown as Raccordement.DemandeComplèteRaccordementTransmiseEvent,
    )
    .otherwise(() => undefined);

  if (!event) {
    return mapToÉtapeInconnueOuIgnoréeTimelineItemProps(modification);
  }

  const { référenceDossierRaccordement, dateQualification } = event.payload;

  return {
    date: dateQualification ?? (modification.createdAt as DateTime.RawType),
    title: (
      <div>
        Un nouveau dossier de raccordement a été crée avec comme référence{' '}
        <span className="font-semibold">{référenceDossierRaccordement}</span>
      </div>
    ),
  };
};
