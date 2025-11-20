import { Période } from '@potentiel-domain/periode';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const périodeNotifiéeProjector = async (event: Période.PériodeNotifiéeEvent) => {
  const identifiantPériode = event.payload.identifiantPériode;
  const périodeToUpsert = await findProjection<Période.PériodeEntity>(
    `période|${identifiantPériode}`,
  );

  if (Option.isNone(périodeToUpsert)) {
    throw new Error('Période non trouvée');
  }

  await updateOneProjection<Période.PériodeEntity>(`période|${event.payload.identifiantPériode}`, {
    estNotifiée: true,
    // On garde la date de notification originale si la période est déjà notifiée
    notifiéeLe: périodeToUpsert.notifiéeLe ?? event.payload.notifiéeLe,
    notifiéePar: périodeToUpsert.notifiéePar ?? event.payload.notifiéePar,
  });
};
