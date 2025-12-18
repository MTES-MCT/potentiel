import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { TypeReprésentantLégal } from '..';
import { IdentifiantProjet } from '../../..';

import { ModifierReprésentantLégalCommand } from './modifierReprésentantLégal.command';

export type ModifierReprésentantLégalUseCase = Message<
  'Lauréat.ReprésentantLégal.UseCase.ModifierReprésentantLégal',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    nomReprésentantLégalValue: string;
    typeReprésentantLégalValue: string;
    dateModificationValue: string;
    raisonValue?: string;
  }
>;

export const registerModifierReprésentantLégalUseCase = () => {
  const runner: MessageHandler<ModifierReprésentantLégalUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    nomReprésentantLégalValue,
    typeReprésentantLégalValue,
    dateModificationValue,
    raisonValue,
  }) =>
    mediator.send<ModifierReprésentantLégalCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.ModifierReprésentantLégal',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        nomReprésentantLégal: nomReprésentantLégalValue,
        typeReprésentantLégal: TypeReprésentantLégal.convertirEnValueType(
          typeReprésentantLégalValue,
        ),
        dateModification: DateTime.convertirEnValueType(dateModificationValue),
        raison: raisonValue,
      },
    });

  mediator.register('Lauréat.ReprésentantLégal.UseCase.ModifierReprésentantLégal', runner);
};
