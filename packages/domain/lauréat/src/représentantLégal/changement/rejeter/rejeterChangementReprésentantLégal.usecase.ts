// Third party
import { Message, MessageHandler, mediator } from 'mediateur';

// Workspaces
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { RejeterChangementReprésentantLégalCommand } from './rejeterChangementReprésentantLégal.command';

export type RejeterChangementReprésentantLégalUseCase = Message<
  'Lauréat.ReprésentantLégal.UseCase.RejeterChangementReprésentantLégal',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateRejetValue: string;
    rejetAutomatiqueValue: boolean;
  }
>;

export const registerRejeterChangementReprésentantLégalUseCase = () => {
  const runner: MessageHandler<RejeterChangementReprésentantLégalUseCase> = async ({
    identifiantUtilisateurValue,
    dateRejetValue,
    identifiantProjetValue,
    rejetAutomatiqueValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateRejet = DateTime.convertirEnValueType(dateRejetValue);
    const identifiantUtilisateur = IdentifiantUtilisateur.convertirEnValueType(
      identifiantUtilisateurValue,
    );

    await mediator.send<RejeterChangementReprésentantLégalCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.RejeterChangementReprésentantLégal',
      data: {
        dateRejet,
        identifiantUtilisateur,
        identifiantProjet,
        rejetAutomatique: rejetAutomatiqueValue,
      },
    });
  };
  mediator.register('Lauréat.ReprésentantLégal.UseCase.RejeterChangementReprésentantLégal', runner);
};
