import { match } from 'ts-pattern';

import { Historique } from '@potentiel-domain/historique';
import { Raccordement } from '@potentiel-domain/laureat';
import { DateTime } from '@potentiel-domain/common';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../../../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

export const mapToDateMiseEnServiceTransmiseTimelineItemProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const event = match(modification)
    .with(
      { type: 'DateMiseEnServiceTransmise-V1' },
      (event) => event as unknown as Raccordement.DateMiseEnServiceTransmiseV1Event,
    )
    .with(
      { type: 'DateMiseEnServiceTransmise-V2' },
      (event) => event as unknown as Raccordement.DateMiseEnServiceTransmiseEvent,
    )
    .otherwise(() => undefined);

  if (!event) {
    return mapToÉtapeInconnueOuIgnoréeTimelineItemProps(modification);
  }

  const { référenceDossierRaccordement } = event.payload;

  return {
    date: modification.createdAt as DateTime.RawType,
    title: (
      <div>
        La date de mise en service a été tranmise pour le dossier de raccordement{' '}
        <span className="font-semibold">{référenceDossierRaccordement}</span>
      </div>
    ),
  };
};
