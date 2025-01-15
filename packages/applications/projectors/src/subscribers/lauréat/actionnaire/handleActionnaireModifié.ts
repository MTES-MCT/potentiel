import { Actionnaire } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Candidature } from '@potentiel-domain/candidature';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';

import { updateOneProjection, upsertProjection } from '../../../infrastructure';

export const handleActionnaireModifié = async ({
  payload: { identifiantProjet, modifiéLe, actionnaire, modifiéPar, raison, pièceJustificative },
}: Actionnaire.ActionnaireModifiéEvent) => {
  await updateOneProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    actionnaire: {
      nom: actionnaire,
      misÀJourLe: modifiéLe,
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

  await upsertProjection<Actionnaire.ModificationActionnaireEntity>(
    `modification-actionnaire|${identifiantProjet}#${modifiéLe}`,
    {
      identifiantProjet,
      projet: {
        nomProjet: candidature.nomProjet,
        appelOffre,
        période,
        famille,
        régionProjet: candidature.localité.région,
      },
      modifiéLe,
      modifiéPar,
      actionnaire,
      raison,
      pièceJustificative,
    },
  );
};
