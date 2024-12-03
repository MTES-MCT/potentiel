import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ModifierActionnaireCommand } from './modifierActionnaire.command';

export type ModifierActionnaireUseCase = Message<
  'Lauréat.Actionnaire.UseCase.ModifierActionnaire',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    actionnaireValue: string;
    dateModificationValue: string;
  }
>;

export const registerModifierActionnaireUseCase = () => {
  const runner: MessageHandler<ModifierActionnaireUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    actionnaireValue,
    dateModificationValue,
  }) =>
    mediator.send<ModifierActionnaireCommand>({
      type: 'Lauréat.Actionnaire.Command.ModifierActionnaire',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        actionnaire: actionnaireValue,
        dateModification: DateTime.convertirEnValueType(dateModificationValue),
      },
    });

  mediator.register('Lauréat.Actionnaire.UseCase.ModifierActionnaire', runner);
};
