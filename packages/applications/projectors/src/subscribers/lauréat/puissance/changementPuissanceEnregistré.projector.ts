import { Puissance } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export const changementPuissanceEnregistréProjector = async ({
  payload: {
    identifiantProjet,
    enregistréLe,
    puissance,
    enregistréPar,
    raison,
    pièceJustificative,
  },
}: Puissance.ChangementPuissanceEnregistréEvent) => {
  await updateOneProjection<Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    puissance,
    miseÀJourLe: enregistréLe,
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
    `changement-puissance|${identifiantProjet}#${enregistréLe}`,
    {
      identifiantProjet,
      demande: {
        nouvellePuissance: puissance,
        unitéPuissance: appelOffre.unitePuissance,
        statut: Puissance.StatutChangementPuissance.informationEnregistrée.statut,
        demandéePar: enregistréPar,
        demandéeLe: enregistréLe,
        raison,
        pièceJustificative,
      },
    },
  );
};
