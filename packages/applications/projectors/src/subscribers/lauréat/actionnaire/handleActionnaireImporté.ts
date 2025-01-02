import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Actionnaire } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';
import { getLogger } from '@potentiel-libraries/monitoring';

import { upsertProjection } from '../../../infrastructure';

export const handleActionnaireImporté = async ({
  payload: { identifiantProjet, actionnaire, importéLe },
}: Actionnaire.ActionnaireImportéEvent) => {
  const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
    type: 'Candidature.Query.ConsulterCandidature',
    data: {
      identifiantProjet,
    },
  });

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
      misÀJourLe: importéLe,
    },
  });
};
