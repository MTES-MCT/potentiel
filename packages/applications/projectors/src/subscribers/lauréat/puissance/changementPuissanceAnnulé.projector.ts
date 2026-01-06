import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';

export const changementPuissanceAnnuléProjector = async ({
  payload: { identifiantProjet },
}: Lauréat.Puissance.ChangementPuissanceAnnuléEvent) => {
  const projectionToUpsert = await findProjection<Lauréat.Puissance.PuissanceEntity>(
    `puissance|${identifiantProjet}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error('Puissance non trouvée', {
      identifiantProjet,
      fonction: 'changementPuissanceAnnuléProjector',
    });
    return;
  }

  if (!projectionToUpsert.dateDemandeEnCours) {
    getLogger().error('Demande de changement de puissance non trouvée', {
      identifiantProjet,
      fonction: 'changementPuissanceAnnuléProjector',
    });
    return;
  }

  await upsertProjection<Lauréat.Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    ...projectionToUpsert,
    dateDemandeEnCours: undefined,
  });

  await updateOneProjection<Lauréat.Puissance.ChangementPuissanceEntity>(
    `changement-puissance|${identifiantProjet}#${projectionToUpsert.dateDemandeEnCours}`,
    {
      demande: {
        statut: Lauréat.Puissance.StatutChangementPuissance.annulé.statut,
      },
    },
  );
};
