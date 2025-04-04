import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { ModifierCahierDesChargesCommand } from './modifierCahierDesCharges.command';

export type ModifierCahierDesChargesUseCase = Message<
  'Lauréat.UseCase.ModifierCahierDesCharges',
  {
    identifiantProjetValue: string;
    modifiéLeValue: string;
    modifiéParValue: string;
    cahierDesChargesValue: string;
  }
>;

export const registerModifierCahierDesChargesUseCase = () => {
  const handler: MessageHandler<ModifierCahierDesChargesUseCase> = async ({
    identifiantProjetValue,
    modifiéLeValue,
    modifiéParValue,
    cahierDesChargesValue,
  }) => {
    await mediator.send<ModifierCahierDesChargesCommand>({
      type: 'Lauréat.Command.ModifierCahierDesCharges',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        modifiéLe: DateTime.convertirEnValueType(modifiéLeValue),
        modifiéPar: Email.convertirEnValueType(modifiéParValue),
        // TODO ValueType
        cahierDesCharges: cahierDesChargesValue as AppelOffre.CahierDesChargesRéférence,
      },
    });
  };

  mediator.register('Lauréat.UseCase.ModifierCahierDesCharges', handler);
};
