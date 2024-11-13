import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { CorrigerReprésentantLégalCommand } from './corrigerReprésentantLégal.command';

export type CorrigerReprésentantLégalUseCase = Message<
  'Lauréat.ReprésentantLégal.UseCase.CorrigerReprésentantLégal',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    nomReprésentantLégalValue: string;
    dateCorrectionValue: string;
  }
>;

export const registerCorrigerReprésentantLégalUseCase = () => {
  const runner: MessageHandler<CorrigerReprésentantLégalUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    nomReprésentantLégalValue,
    dateCorrectionValue,
  }) =>
    mediator.send<CorrigerReprésentantLégalCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.CorrigerReprésentantLégal',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        nomReprésentantLégal: nomReprésentantLégalValue,
        dateCorrection: DateTime.convertirEnValueType(dateCorrectionValue),
      },
    });

  mediator.register('Lauréat.ReprésentantLégal.UseCase.CorrigerReprésentantLégal', runner);
};
