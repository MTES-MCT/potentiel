import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../..';
import { TypologieDuProjet } from '../../../../candidature';

import { ModifierTypologieDuProjetCommand } from './modifierTypologieDuProjet.command';

export type ModifierTypologieDuProjetUseCase = Message<
  'Lauréat.Installation.UseCase.ModifierTypologieDuProjet',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    typologieDuProjetValue: TypologieDuProjet.RawType[];
    dateModificationValue: string;
  }
>;

export const registerModifierTypologieDuProjetUseCase = () => {
  const runner: MessageHandler<ModifierTypologieDuProjetUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    typologieDuProjetValue,
    dateModificationValue,
  }) => {
    await mediator.send<ModifierTypologieDuProjetCommand>({
      type: 'Lauréat.Installation.Command.ModifierTypologieDuProjet',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        typologieDuProjet: typologieDuProjetValue.map(TypologieDuProjet.convertirEnValueType),
        dateModification: DateTime.convertirEnValueType(dateModificationValue),
      },
    });
  };
  mediator.register('Lauréat.Installation.UseCase.ModifierTypologieDuProjet', runner);
};
