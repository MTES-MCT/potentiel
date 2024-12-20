import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { TâchePlanifiéeExecutéeEvent } from '@potentiel-domain/tache-planifiee';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { getLogger } from '@potentiel-libraries/monitoring';

export const handleTâchePlanifiéeExécutée = async (event: TâchePlanifiéeExecutéeEvent) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);

  const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: {
      identifiantAppelOffre: identifiantProjet.appelOffre,
    },
  });

  if (Option.isNone(appelOffre)) {
    getLogger().error(`Appel d'offre non trouvée`, {
      identifiantProjet: identifiantProjet.formatter(),
      context: 'Lauréat.ReprésentantLégal.Saga.HandleTâchePlanifiéeExécutée',
    });
    return;
  }

  const période = appelOffre.periodes.find((p) => p.id === identifiantProjet.période);

  if (!période) {
    getLogger().error(`Période non trouvée`, {
      identifiantProjet: identifiantProjet.formatter(),
      context: 'Lauréat.ReprésentantLégal.Saga.HandleTâchePlanifiéeExécutée',
    });
    return;
  }

  const {
    changement: {
      représentantLégal: { typeTâchePlanifiée },
    },
  } = période;

  match(typeTâchePlanifiée)
    .with('accord-automatique', async () => {
      /**
       * @todo Brancher le usecase d'accord
       */
    })
    .with('rejet-automatique', async () => {
      /**
       * @todo Brancher le usecase de rejet
       */
    })
    .exhaustive();
};
