import { Actionnaire } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';

import { upsertProjection } from '../../../infrastructure';

export const changementActionnaireAnnuléProjector = async ({
  payload: { identifiantProjet, annuléLe, annuléPar },
}: Actionnaire.ChangementActionnaireAnnuléEvent) => {
  const projectionToUpsert = await findProjection<Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error(`Actionnaire non trouvé`, { identifiantProjet });
    return;
  }

  if (!projectionToUpsert.demandeEnCours) {
    getLogger().error(`Demande non trouvée`, { identifiantProjet });
    return;
  }

  await upsertProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    ...projectionToUpsert,
    demandeEnCours: undefined,
  });

  await upsertProjection<Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${projectionToUpsert.demandeEnCours.demandéeLe}`,
    {
      identifiantProjet,
      projet: projectionToUpsert.projet,
      demande: {
        ...projectionToUpsert.demandeEnCours,
        statut: Actionnaire.StatutChangementActionnaire.annulé.statut,
        annulation: {
          annuléeLe: annuléLe,
          annuléePar: annuléPar,
        },
      },
    },
  );
};
