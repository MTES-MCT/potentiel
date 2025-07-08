import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../../../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

export const mapToDateMiseEnServiceTransmiseTimelineItemProps = (
  modification: Lauréat.Raccordement.HistoriqueRaccordementProjetListItemReadModel,
) => {
  const event = match(modification)
    .with({ type: 'DateMiseEnServiceTransmise-V1' }, (event) => event)
    .with({ type: 'DateMiseEnServiceTransmise-V2' }, (event) => event)
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
