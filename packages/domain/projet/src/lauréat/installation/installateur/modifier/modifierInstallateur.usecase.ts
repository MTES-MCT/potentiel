import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../..';

import { ModifierInstallateurCommand } from './modifierInstallateur.command';

export type ModifierInstallateurUseCase = Message<
  'Lauréat.Installation.UseCase.ModifierInstallateur',
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
      type: 'Lauréat.Installation.Command.ModifierInstallateur',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        installateur: installateurValue,
        dateModification: DateTime.convertirEnValueType(dateModificationValue),
      },
    });
  };
  mediator.register('Lauréat.Installation.UseCase.ModifierInstallateur', runner);
};
