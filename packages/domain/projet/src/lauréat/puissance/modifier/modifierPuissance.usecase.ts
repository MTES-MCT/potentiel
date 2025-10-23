import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ModifierPuissanceCommand } from './modifierPuissance.command';

export type ModifierPuissanceUseCase = Message<
  'Lauréat.Puissance.UseCase.ModifierPuissance',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    puissanceValue?: number;
    puissanceDeSiteValue?: number;
    dateModificationValue: string;
    raisonValue?: string;
  }
>;

export const registerModifierPuissanceUseCase = () => {
  const runner: MessageHandler<ModifierPuissanceUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    puissanceValue,
    puissanceDeSiteValue,
    dateModificationValue,
    raisonValue,
  }) => {
    await mediator.send<ModifierPuissanceCommand>({
      type: 'Lauréat.Puissance.Command.ModifierPuissance',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        puissance: puissanceValue,
        puissanceDeSite: puissanceDeSiteValue,
        dateModification: DateTime.convertirEnValueType(dateModificationValue),
        raison: raisonValue,
      },
    });
  };
  mediator.register('Lauréat.Puissance.UseCase.ModifierPuissance', runner);
};
