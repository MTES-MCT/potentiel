import { Période } from '@potentiel-domain/periode';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const périodeImportéeProjector = async (event: Période.PériodeImportéeEvent) => {
  const identifiantPériode = event.payload.identifiantPériode;
  const périodeToUpsert = await findProjection<Période.PériodeEntity>(
    `période|${identifiantPériode}`,
  );

  if (Option.isNone(périodeToUpsert)) {
    throw new Error('Période non trouvée');
  }

  await updateOneProjection<Période.PériodeEntity>(`période|${event.payload.identifiantPériode}`, {
    statut: Période.StatutPériode.notifiée.formatter(),
    importéeLe: event.payload.importéLe,
    importéePar: event.payload.importéPar,
    // on liste les projets non importés du dernier import
    projetsEnErreur: event.payload.projetsEnErreur,
  });
};
