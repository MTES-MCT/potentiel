import { mediator } from 'mediateur';

import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { Candidature } from '@potentiel-domain/candidature';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { upsertProjection } from '../../../infrastructure';

export const handleChangementReprésentantLégalDemandé = async ({
  payload: {
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    pièceJustificative,
    demandéLe,
    demandéPar,
  },
}: ReprésentantLégal.ChangementReprésentantLégalDemandéEvent) => {
  const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
    type: 'Candidature.Query.ConsulterCandidature',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(candidature)) {
    getLogger().error('Projet non trouvé', {
      identifiantProjet,
      application: 'projectors',
      fonction: 'handleChangementReprésentantLégalDemandé',
    });
    return;
  }

  const { appelOffre, période, famille, numéroCRE } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);

  await upsertProjection<ReprésentantLégal.DemandeChangementReprésentantLégalEntity>(
    `demande-changement-représentant-légal|${identifiantProjet}`,
    {
      identifiantProjet,
      projet: {
        nom: candidature.nomProjet,
        appelOffre,
        période,
        famille,
        numéroCRE,
        région: candidature.localité.région,
      },
      statut: ReprésentantLégal.StatutDemandeChangementReprésentantLégal.demandé.formatter(),
      nomReprésentantLégal,
      typeReprésentantLégal,
      pièceJustificative,
      demandéLe,
      demandéPar,
    },
  );
};
