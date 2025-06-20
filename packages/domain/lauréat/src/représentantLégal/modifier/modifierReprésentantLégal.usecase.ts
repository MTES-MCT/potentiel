import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { ModifierReprésentantLégalCommand } from './modifierReprésentantLégal.command';

export type ModifierReprésentantLégalUseCase = Message<
  'Lauréat.ReprésentantLégal.UseCase.ModifierReprésentantLégal',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    nomReprésentantLégalValue: string;
    typeReprésentantLégalValue: string;
    dateModificationValue: string;
  }
>;

export const registerModifierReprésentantLégalUseCase = () => {
  const runner: MessageHandler<ModifierReprésentantLégalUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    nomReprésentantLégalValue,
    typeReprésentantLégalValue,
    dateModificationValue,
  }) =>
    mediator.send<ModifierReprésentantLégalCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.ModifierReprésentantLégal',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        nomReprésentantLégal: nomReprésentantLégalValue,
        typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.convertirEnValueType(
          typeReprésentantLégalValue,
        ),
        dateModification: DateTime.convertirEnValueType(dateModificationValue),
      },
    });

  mediator.register('Lauréat.ReprésentantLégal.UseCase.ModifierReprésentantLégal', runner);
};
