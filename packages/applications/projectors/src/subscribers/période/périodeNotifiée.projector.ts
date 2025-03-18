import { Période } from '@potentiel-domain/periode';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import {
  upsertProjection,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const périodeNotifiéeProjector = async (event: Période.PériodeNotifiéeEvent) => {
  const identifiantPériode = event.payload.identifiantPériode;
  const périodeToUpsert = await findProjection<Période.PériodeEntity>(
    `période|${identifiantPériode}`,
  );

  if (Option.isNone(périodeToUpsert)) {
    await upsertProjection<Période.PériodeEntity>(`période|${identifiantPériode}`, {
      identifiantPériode,
      appelOffre: Période.IdentifiantPériode.convertirEnValueType(identifiantPériode).appelOffre,
      période: Période.IdentifiantPériode.convertirEnValueType(identifiantPériode).période,
      estNotifiée: true,
      notifiéeLe: event.payload.notifiéeLe,
      notifiéePar: event.payload.notifiéePar,
    });
  } else {
    // ce cas n'arrive pas pour le moment
    // mais sera utile si on ajoute un événement en amont pour ajouter la période
    await updateOneProjection<Période.PériodeEntity>(
      `période|${event.payload.identifiantPériode}`,
      {
        estNotifiée: true,
        notifiéeLe: périodeToUpsert.notifiéeLe ?? event.payload.notifiéeLe,
        notifiéePar: périodeToUpsert.notifiéePar ?? event.payload.notifiéePar,
      },
    );
  }
};
