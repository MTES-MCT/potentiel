import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

import { ModifierProducteurCommand } from './modifierProducteur.command';

export type ModifierProducteurUseCase = Message<
  'Lauréat.Producteur.UseCase.ModifierProducteur',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    producteurValue: string;
    dateModificationValue: string;
  }
>;

export const registerModifierProducteurUseCase = () => {
  const runner: MessageHandler<ModifierProducteurUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    producteurValue,
    dateModificationValue,
  }) => {
    await mediator.send<ModifierProducteurCommand>({
      type: 'Lauréat.Producteur.Command.ModifierProducteur',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        producteur: producteurValue,
        dateModification: DateTime.convertirEnValueType(dateModificationValue),
      },
    });
  };
  mediator.register('Lauréat.Producteur.UseCase.ModifierProducteur', runner);
};
