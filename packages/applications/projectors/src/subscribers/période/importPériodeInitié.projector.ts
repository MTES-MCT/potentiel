import { Période } from '@potentiel-domain/periode';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const importPériodeInitiéProjector = async (event: Période.ImportPériodeInitiéEvent) => {
  const identifiantPériode = event.payload.identifiantPériode;
  const périodeToUpsert = await findProjection<Période.PériodeEntity>(
    `période|${identifiantPériode}`,
  );

  if (Option.isNone(périodeToUpsert)) {
    throw new Error('Période non trouvée');
  }

  await updateOneProjection<Période.PériodeEntity>(`période|${event.payload.identifiantPériode}`, {
    statut: Période.StatutPériode.importInitié.formatter(),
  });
};
