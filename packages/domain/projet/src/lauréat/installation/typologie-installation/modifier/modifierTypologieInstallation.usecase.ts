import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../..';
import { TypologieInstallation } from '../../../../candidature';

import { ModifierTypologieInstallationCommand } from './modifierTypologieInstallation.command';

export type ModifierTypologieInstallationUseCase = Message<
  'Lauréat.Installation.UseCase.ModifierTypologieInstallation',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    typologieInstallationValue: TypologieInstallation.RawType[];
    dateModificationValue: string;
  }
>;

export const registerModifierTypologieInstallationUseCase = () => {
  const runner: MessageHandler<ModifierTypologieInstallationUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    typologieInstallationValue,
    dateModificationValue,
  }) => {
    await mediator.send<ModifierTypologieInstallationCommand>({
      type: 'Lauréat.Installation.Command.ModifierTypologieInstallation',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        typologieInstallation: typologieInstallationValue.map(
          TypologieInstallation.convertirEnValueType,
        ),
        dateModification: DateTime.convertirEnValueType(dateModificationValue),
      },
    });
  };
  mediator.register('Lauréat.Installation.UseCase.ModifierTypologieInstallation', runner);
};
