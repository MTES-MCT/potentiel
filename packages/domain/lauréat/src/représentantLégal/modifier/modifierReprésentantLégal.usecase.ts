import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ModifierReprésentantLégalCommand } from './modifierReprésentantLégal.command';

export type ModifierReprésentantLégalUseCase = Message<
  'Lauréat.ReprésentantLégal.UseCase.ModifierReprésentantLégal',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    nomReprésentantLégalValue: string;
    dateModificationValue: string;
  }
>;

export const registerModifierReprésentantLégalUseCase = () => {
  const runner: MessageHandler<ModifierReprésentantLégalUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    nomReprésentantLégalValue,
    dateModificationValue,
  }) =>
    mediator.send<ModifierReprésentantLégalCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.ModifierReprésentantLégal',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        nomReprésentantLégal: nomReprésentantLégalValue,
        dateModification: DateTime.convertirEnValueType(dateModificationValue),
      },
    });

  mediator.register('Lauréat.ReprésentantLégal.UseCase.ModifierReprésentantLégal', runner);
};
