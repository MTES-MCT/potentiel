import { Actionnaire } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';

import { upsertProjection } from '../../../infrastructure';

export const handleActionnaireTransmis = async ({
  payload: { identifiantProjet, actionnaire, transmisLe },
}: Actionnaire.ActionnaireTransmisEvent) => {
  const candidature = await findProjection<Candidature.CandidatureEntity>(
    `candidature|${identifiantProjet}`,
  );

  if (Option.isNone(candidature)) {
    getLogger().error('Candidature non trouvée', {
      identifiantProjet,
    });
    return;
  }

  const { appelOffre, période, famille, numéroCRE } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);

  await upsertProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    identifiantProjet,
    projet: {
      nom: candidature.nomProjet,
      appelOffre,
      période,
      famille,
      numéroCRE,
      région: candidature.localité.région,
    },
    actionnaire: {
      nom: actionnaire,
      misÀJourLe: transmisLe,
    },
  });
};
