import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { removeProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

export const changementPuissanceSuppriméProjector = async ({
  payload: { identifiantProjet },
}: Lauréat.Puissance.ChangementPuissanceSuppriméEvent) => {
  const projectionToUpsert = await findProjection<Lauréat.Puissance.PuissanceEntity>(
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

  await upsertProjection<Lauréat.Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    ...projectionToUpsert,
    dateDemandeEnCours: undefined,
  });

  await removeProjection<Lauréat.Puissance.ChangementPuissanceEntity>(
    `changement-puissance|${identifiantProjet}#${projectionToUpsert.dateDemandeEnCours}`,
  );
};
