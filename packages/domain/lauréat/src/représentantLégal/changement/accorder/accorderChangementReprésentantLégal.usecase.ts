// Third party
import { Message, MessageHandler, mediator } from 'mediateur';

// Workspaces
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { TypeReprésentantLégal } from '../..';

import { AccorderChangementReprésentantLégalCommand } from './accorderChangementReprésentantLégal.command';

export type AccorderChangementReprésentantLégalUseCase = Message<
  'Lauréat.ReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    nomReprésentantLégalValue: string;
    typeReprésentantLégalValue: string;
    dateAccordValue: string;
  }
>;

export const registerAccorderChangementReprésentantLégalUseCase = () => {
  const runner: MessageHandler<AccorderChangementReprésentantLégalUseCase> = async ({
    identifiantUtilisateurValue,
    dateAccordValue,
    identifiantProjetValue,
    nomReprésentantLégalValue,
    typeReprésentantLégalValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateAccord = DateTime.convertirEnValueType(dateAccordValue);
    const identifiantUtilisateur = IdentifiantUtilisateur.convertirEnValueType(
      identifiantUtilisateurValue,
    );

    await mediator.send<AccorderChangementReprésentantLégalCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.AccorderChangementReprésentantLégal',
      data: {
        nomReprésentantLégal: nomReprésentantLégalValue,
        typeReprésentantLégal: TypeReprésentantLégal.convertirEnValueType(
          typeReprésentantLégalValue,
        ),
        dateAccord,
        identifiantUtilisateur,
        identifiantProjet,
      },
    });
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
    runner,
  );
};
