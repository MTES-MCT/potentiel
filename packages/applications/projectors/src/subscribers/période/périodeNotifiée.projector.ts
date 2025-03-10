import { Période } from '@potentiel-domain/periode';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projections';

import { upsertProjection } from '../../infrastructure/upsertProjection';

export const périodeNotifiéeProjector = async (event: Période.PériodeNotifiéeEvent) => {
  const périodeToUpsert = await getPériodeToUpsert(event.payload.identifiantPériode);

  await upsertProjection<Période.PériodeEntity>(`période|${event.payload.identifiantPériode}`, {
    ...event.payload,
    estNotifiée: true,
    notifiéeLe: périodeToUpsert.notifiéeLe ?? event.payload.notifiéeLe,
    notifiéePar: périodeToUpsert.notifiéePar ?? event.payload.notifiéePar,
  });
};

const getPériodeToUpsert = async (
  identifiantPériode: Période.IdentifiantPériode.RawType,
): Promise<Omit<Période.PériodeEntity, 'type'>> => {
  const période = await findProjection<Période.PériodeEntity>(`période|${identifiantPériode}`);

  return Option.isSome(période)
    ? période
    : {
        identifiantPériode,
        appelOffre: Période.IdentifiantPériode.convertirEnValueType(identifiantPériode).appelOffre,
        période: Période.IdentifiantPériode.convertirEnValueType(identifiantPériode).période,
        estNotifiée: false,
      };
};
