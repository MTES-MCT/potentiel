import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { DateTime, Email } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import {
  AccorderChangementReprésentantLégalUseCase,
  RejeterChangementReprésentantLégalUseCase,
} from '..';
import { IdentifiantProjet, Lauréat } from '../../..';
import { SupprimerDocumentProjetSensibleCommand } from '../changement/supprimerDocumentSensible/supprimerDocumentProjetSensible.command';

export const tâchePlanifiéeReprésentantLégalExecutéeSaga = async (
  event: Lauréat.TâchePlanifiée.TâchePlanifiéeExecutéeEvent,
) => {
  const { payload } = event;

  return match(payload)
    .with(
      { typeTâchePlanifiée: 'représentant-légal.gestion-automatique-demande-changement' },
      tâchePlanifiéeGestionAutomatiqueExecutéeSaga,
    )
    .with(
      { typeTâchePlanifiée: 'représentant-légal.suppression-document-à-trois-mois' },
      tâchePlanifiéeSuppressionDocumentExecutéeSaga,
    )
    .otherwise(() => {});
};

const tâchePlanifiéeSuppressionDocumentExecutéeSaga = async ({
  identifiantProjet,
}: Lauréat.TâchePlanifiée.TâchePlanifiéeExecutéeEvent['payload']) => {
  await mediator.send<SupprimerDocumentProjetSensibleCommand>({
    type: 'Lauréat.ReprésentantLégal.Command.SupprimerDocumentProjetSensible',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      raison: 'Pièce justificative supprimée automatiquement après 3 mois',
    },
  });
};

const tâchePlanifiéeGestionAutomatiqueExecutéeSaga = async ({
  identifiantProjet,
}: Lauréat.TâchePlanifiée.TâchePlanifiéeExecutéeEvent['payload']) => {
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
          identifiantUtilisateurValue: Email.système.formatter(),
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
          identifiantUtilisateurValue: Email.système.formatter(),
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
