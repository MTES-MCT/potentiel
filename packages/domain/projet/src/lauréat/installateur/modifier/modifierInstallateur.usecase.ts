import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ModifierInstallateurCommand } from './modifierInstallateur.command';

export type ModifierInstallateurUseCase = Message<
  'Lauréat.Installateur.UseCase.ModifierInstallateur',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    installateurValue: string;
    dateModificationValue: string;
  }
>;

export const registerModifierInstallateurUseCase = () => {
  const runner: MessageHandler<ModifierInstallateurUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    installateurValue,
    dateModificationValue,
  }) => {
    await mediator.send<ModifierInstallateurCommand>({
      type: 'Lauréat.Installateur.Command.ModifierInstallateur',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        installateur: installateurValue,
        dateModification: DateTime.convertirEnValueType(dateModificationValue),
      },
    });
  };
  mediator.register('Lauréat.Installateur.UseCase.ModifierInstallateur', runner);
};
