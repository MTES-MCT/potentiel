import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { DateTime, Email } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import {
  AccorderChangementReprésentantLégalUseCase,
  RejeterChangementReprésentantLégalUseCase,
  TypeTâchePlanifiéeChangementReprésentantLégal,
} from '..';
import { Lauréat } from '../../..';

export const tâchePlanifiéeGestionAutomatiqueDemandeChangementExecutéeSaga = async ({
  payload: { identifiantProjet, typeTâchePlanifiée },
}: Lauréat.TâchePlanifiée.TâchePlanifiéeExecutéeEvent) => {
  if (
    typeTâchePlanifiée !==
    TypeTâchePlanifiéeChangementReprésentantLégal.gestionAutomatiqueDemandeChangement.type
  ) {
    return;
  }

  const cahierDesCharges = await mediator.send<Lauréat.ConsulterCahierDesChargesQuery>({
    type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesCharges',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });

  if (Option.isNone(cahierDesCharges)) {
    throw new TâchePlanifiéeGestionAutomatiqueDemandeChangementError(
      `Projet non trouvé`,
      identifiantProjet,
    );
  }

  const règlesChangement = cahierDesCharges.getRèglesChangements('représentantLégal');

  if (!règlesChangement.instructionAutomatique) {
    return;
  }

  await match(règlesChangement.instructionAutomatique)
    .with('accord', async () => {
      await mediator.send<AccorderChangementReprésentantLégalUseCase>({
        type: 'Lauréat.ReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
        data: {
          identifiantProjetValue: identifiantProjet,
          identifiantUtilisateurValue: Email.system().formatter(),
          dateAccordValue: DateTime.now().formatter(),
          accordAutomatiqueValue: true,
        },
      });
    })
    .with('rejet', async () => {
      await mediator.send<RejeterChangementReprésentantLégalUseCase>({
        type: 'Lauréat.ReprésentantLégal.UseCase.RejeterChangementReprésentantLégal',
        data: {
          identifiantProjetValue: identifiantProjet,
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
