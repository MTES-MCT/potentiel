import { Actionnaire } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Candidature } from '@potentiel-domain/candidature';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';

import { updateOneProjection, upsertProjection } from '../../../infrastructure';

export const changementActionnaireEnregistréProjector = async ({
  payload: {
    identifiantProjet,
    enregistréLe,
    actionnaire,
    enregistréPar,
    raison,
    pièceJustificative,
  },
}: Actionnaire.ChangementActionnaireEnregistréEvent) => {
  await updateOneProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    actionnaire: {
      nom: actionnaire,
      misÀJourLe: enregistréLe,
    },
  });

  const candidature = await findProjection<Candidature.CandidatureEntity>(
    `candidature|${identifiantProjet}`,
  );

  if (Option.isNone(candidature)) {
    getLogger().error('Candidature non trouvée', {
      identifiantProjet,
    });
    return;
  }

  const { appelOffre, période, famille } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);

  await upsertProjection<Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${enregistréLe}`,
    {
      identifiantProjet,
      projet: {
        nom: candidature.nomProjet,
        appelOffre,
        période,
        famille,
        région: candidature.localité.région,
      },
      demande: {
        nouvelActionnaire: actionnaire,
        statut: Actionnaire.StatutChangementActionnaire.informationEnregistrée.statut,
        demandéePar: enregistréPar,
        demandéeLe: enregistréLe,
        raison,
        pièceJustificative,
      },
    },
  );
};
