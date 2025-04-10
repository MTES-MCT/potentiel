import { Puissance } from '@potentiel-domain/laureat';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const changementPuissanceDemandéProjector = async ({
  payload: {
    puissance,
    autoritéCompétente,
    identifiantProjet,
    demandéLe,
    demandéPar,
    raison,
    pièceJustificative: { format },
  },
}: Puissance.ChangementPuissanceDemandéEvent) => {
  const projectionToUpsert = await findProjection<Puissance.PuissanceEntity>(
    `puissance|${identifiantProjet}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error(`Puissance non trouvée`, { identifiantProjet });
    return;
  }

  await upsertProjection<Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    ...projectionToUpsert,
    dateDemandeEnCours: demandéLe,
  });

  const appelOffre = await findProjection<AppelOffre.AppelOffreEntity>(
    `appel-offre|${IdentifiantProjet.convertirEnValueType(identifiantProjet).appelOffre}`,
    {
      select: ['unitePuissance'],
    },
  );

  if (Option.isNone(appelOffre)) {
    getLogger().error(`Appel d'offre non trouvé`, { identifiantProjet });
    return;
  }

  await upsertProjection<Puissance.ChangementPuissanceEntity>(
    `changement-puissance|${identifiantProjet}#${demandéLe}`,
    {
      identifiantProjet,
      demande: {
        statut: Puissance.StatutChangementPuissance.demandé.statut,
        autoritéCompétente,
        nouvellePuissance: puissance,
        unitéPuissance: appelOffre.unitePuissance,
        demandéePar: demandéPar,
        demandéeLe: demandéLe,
        raison,
        pièceJustificative: {
          format,
        },
      },
    },
  );
};
