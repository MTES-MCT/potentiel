import { Puissance } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { removeProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';

export const changementPuissanceAnnuléProjector = async ({
  payload: { identifiantProjet },
}: Puissance.ChangementPuissanceAnnuléEvent) => {
  const projectionToUpsert = await findProjection<Puissance.PuissanceEntity>(
    `puissance|${identifiantProjet}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error(`Puissance non trouvée`, {
      identifiantProjet,
      fonction: 'changementPuissanceAnnuléProjector',
    });
    return;
  }

  if (!projectionToUpsert.dateDemandeEnCours) {
    getLogger().error(`Demande puissance non trouvée`, {
      identifiantProjet,
      fonction: 'changementPuissanceAnnuléProjector',
    });
    return;
  }

  await upsertProjection<Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    ...projectionToUpsert,
    dateDemandeEnCours: undefined,
  });

  await removeProjection<Puissance.ChangementPuissanceEntity>(
    `changement-puissance|${identifiantProjet}#${projectionToUpsert.dateDemandeEnCours}`,
  );
};
