import { Puissance } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { removeProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

export const changementPuissanceSuppriméProjector = async ({
  payload: { identifiantProjet },
}: Puissance.ChangementPuissanceSuppriméEvent) => {
  const projectionToUpsert = await findProjection<Puissance.PuissanceEntity>(
    `puissance|${identifiantProjet}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error('Puissance non trouvée', {
      identifiantProjet,
      fonction: 'changementPuissanceSuppriméProjector',
    });
    return;
  }

  if (!projectionToUpsert.dateDemandeEnCours) {
    getLogger().error(`Demande de changement de puissance non trouvée`, {
      identifiantProjet,
      fonction: 'changementPuissanceSuppriméProjector',
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
