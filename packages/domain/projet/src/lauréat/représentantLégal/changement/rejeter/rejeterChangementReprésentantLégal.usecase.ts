import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { SupprimerDocumentProjetSensibleCommand } from '../supprimerDocumentSensible/supprimerDocumentProjetSensible.command.js';
import { IdentifiantProjet } from '../../../../index.js';

import { RejeterChangementReprésentantLégalCommand } from './rejeterChangementReprésentantLégal.command.js';

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

export const registerRejeterChangementReprésentantLégalUseCase = () => {
  const runner: MessageHandler<RejeterChangementReprésentantLégalUseCase> = async ({
    identifiantUtilisateurValue,
    identifiantProjetValue,
    dateRejetValue,
    motifRejetValue,
    rejetAutomatiqueValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateRejet = DateTime.convertirEnValueType(dateRejetValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

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

    await mediator.send<SupprimerDocumentProjetSensibleCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.SupprimerDocumentProjetSensible',
      data: {
        identifiantProjet,
        raison: 'Pièce justificative supprimée automatiquement après rejet',
      },
    });
  };
  mediator.register('Lauréat.ReprésentantLégal.UseCase.RejeterChangementReprésentantLégal', runner);
};
