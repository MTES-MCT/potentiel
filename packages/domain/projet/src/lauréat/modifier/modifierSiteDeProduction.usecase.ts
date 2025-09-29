import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { Localité } from '../../candidature';

import { ModifierSiteDeProductionCommand } from './modifierSiteDeProduction.command';

export type ModifierSiteDeProductionUseCase = Message<
  'Lauréat.UseCase.ModifierSiteDeProduction',
  {
    identifiantProjetValue: string;
    modifiéLeValue: string;
    modifiéParValue: string;
    localitéValue: Localité.RawType;
    raisonValue: string | undefined;
  }
>;

export const registerModifierSiteDeProductionUseCase = () => {
  const handler: MessageHandler<ModifierSiteDeProductionUseCase> = async ({
    identifiantProjetValue,
    modifiéLeValue,
    modifiéParValue,
    localitéValue,
    raisonValue,
  }) => {
    await mediator.send<ModifierSiteDeProductionCommand>({
      type: 'Lauréat.Command.ModifierSiteDeProduction',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        modifiéLe: DateTime.convertirEnValueType(modifiéLeValue),
        modifiéPar: Email.convertirEnValueType(modifiéParValue),
        localité: Localité.bind(localitéValue),
        raison: raisonValue,
      },
    });
  };

  mediator.register('Lauréat.UseCase.ModifierSiteDeProduction', handler);
};
