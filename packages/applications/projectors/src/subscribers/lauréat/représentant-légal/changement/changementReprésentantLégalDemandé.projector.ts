import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { Candidature } from '@potentiel-domain/candidature';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { findProjection } from '@potentiel-infrastructure/pg-projections';

import { upsertProjection } from '../../../../infrastructure';

export const changementReprésentantLégalDemandéProjector = async ({
  payload: {
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    pièceJustificative,
    demandéLe,
    demandéPar,
  },
}: ReprésentantLégal.ChangementReprésentantLégalDemandéEvent) => {
  const candidature = await findProjection<Candidature.CandidatureEntity>(
    `candidature|${identifiantProjet}`,
  );

  if (Option.isNone(candidature)) {
    getLogger().error('Projet non trouvé', {
      identifiantProjet,
      application: 'projector',
      fonction: 'changementReprésentantLégalDemandéProjector',
    });
    return;
  }

  const { appelOffre, période, famille, numéroCRE } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);

  const identifiantChangement = `${identifiantProjet}#${demandéLe}`;

  await upsertProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
    `changement-représentant-légal|${identifiantChangement}`,
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
      demande: {
        statut: ReprésentantLégal.StatutChangementReprésentantLégal.demandé.formatter(),
        nomReprésentantLégal,
        typeReprésentantLégal,
        pièceJustificative,
        demandéLe,
        demandéPar,
      },
    },
  );
};
