import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import {
  AccorderChangementReprésentantLégalUseCase,
  RejeterChangementReprésentantLégalUseCase,
  TypeTâchePlanifiéeChangementReprésentantLégal,
} from '..';
import { Lauréat } from '../../..';

export const tâchePlanifiéeGestionAutomatiqueDemandeChangementExecutéeSaga = async (
  event: Lauréat.TâchePlanifiée.TâchePlanifiéeExecutéeEvent,
) => {
  if (
    event.payload.typeTâchePlanifiée !==
    TypeTâchePlanifiéeChangementReprésentantLégal.gestionAutomatiqueDemandeChangement.type
  ) {
    return;
  }

  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);

  const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: {
      identifiantAppelOffre: identifiantProjet.appelOffre,
    },
  });

  if (Option.isNone(appelOffre)) {
    throw new TâchePlanifiéeGestionAutomatiqueDemandeChangementError(
      `Appel d'offre non trouvé`,
      identifiantProjet.formatter(),
    );
  }

  const période = appelOffre.periodes.find((p) => p.id === identifiantProjet.période);

  if (!période) {
    throw new TâchePlanifiéeGestionAutomatiqueDemandeChangementError(
      `Période non trouvée`,
      identifiantProjet.formatter(),
    );
  }

  const règlesChangement =
    période.changement?.représentantLégal ?? appelOffre.changement.représentantLégal;

  if (!règlesChangement || !règlesChangement.typeTâchePlanifiée) {
    return;
  }

  await match(règlesChangement.typeTâchePlanifiée)
    .with('accord-automatique', async () => {
      await mediator.send<AccorderChangementReprésentantLégalUseCase>({
        type: 'Lauréat.ReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          identifiantUtilisateurValue: Email.system().formatter(),
          dateAccordValue: DateTime.now().formatter(),
          accordAutomatiqueValue: true,
        },
      });
    })
    .with('rejet-automatique', async () => {
      await mediator.send<RejeterChangementReprésentantLégalUseCase>({
        type: 'Lauréat.ReprésentantLégal.UseCase.RejeterChangementReprésentantLégal',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          identifiantUtilisateurValue: Email.system().formatter(),
          motifRejetValue: 'Rejet automatique',
          dateRejetValue: DateTime.now().formatter(),
          rejetAutomatiqueValue: true,
        },
      });
    })
    .exhaustive();
};

class TâchePlanifiéeGestionAutomatiqueDemandeChangementError extends Error {
  constructor(
    public cause: string,
    public identifiantProjet: string,
  ) {
    super(
      `Impossible de traiter automatiquement la tâche planifiée pour le changement de représentant légal`,
    );
  }
}
