// Third party
import { Message, MessageHandler, mediator } from 'mediateur';

// Workspaces
import { LoadAggregate } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { SupprimerDocumentProjetSensibleCommand } from '@potentiel-domain/document';

import { loadReprésentantLégalFactory } from '../../représentantLégal.aggregate';

import { RejeterChangementReprésentantLégalCommand } from './rejeterChangementReprésentantLégal.command';

export type RejeterChangementReprésentantLégalUseCase = Message<
  'Lauréat.ReprésentantLégal.UseCase.RejeterChangementReprésentantLégal',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateRejetValue: string;
    motifRejetValue: string;
    rejetAutomatiqueValue: boolean;
  }
>;

export const registerRejeterChangementReprésentantLégalUseCase = (loadAggregate: LoadAggregate) => {
  const load = loadReprésentantLégalFactory(loadAggregate);

  const runner: MessageHandler<RejeterChangementReprésentantLégalUseCase> = async ({
    identifiantUtilisateurValue,
    identifiantProjetValue,
    dateRejetValue,
    motifRejetValue,
    rejetAutomatiqueValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateRejet = DateTime.convertirEnValueType(dateRejetValue);
    const identifiantUtilisateur = IdentifiantUtilisateur.convertirEnValueType(
      identifiantUtilisateurValue,
    );

    const représentantLégal = await load(identifiantProjet);

    await mediator.send<RejeterChangementReprésentantLégalCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.RejeterChangementReprésentantLégal',
      data: {
        dateRejet,
        identifiantUtilisateur,
        identifiantProjet,
        motifRejet: motifRejetValue,
        rejetAutomatique: rejetAutomatiqueValue,
      },
    });

    if (représentantLégal.demande) {
      await mediator.send<SupprimerDocumentProjetSensibleCommand>({
        type: 'Document.Command.SupprimerDocumentProjetSensible',
        data: {
          documentProjet: représentantLégal.demande.pièceJustificative,
          raison: 'Pièce justificative supprimée automatiquement après annulation',
        },
      });
    }
  };
  mediator.register('Lauréat.ReprésentantLégal.UseCase.RejeterChangementReprésentantLégal', runner);
};
