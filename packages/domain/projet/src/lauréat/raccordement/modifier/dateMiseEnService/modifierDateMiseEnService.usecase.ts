import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';
import { IdentifiantProjet } from '../../../../index.js';

import { ModifierDateMiseEnServiceCommand } from './modifierDateMiseEnService.command.js';

export type ModifierDateMiseEnServiceUseCase = Message<
  'Lauréat.Raccordement.UseCase.ModifierDateMiseEnService',
  {
    dateMiseEnServiceValue: string;
    référenceDossierValue: string;
    identifiantProjetValue: string;
    modifiéeLeValue: string;
    modifiéeParValue: string;
  }
>;

export const registerModifierDateMiseEnServiceUseCase = () => {
  const runner: MessageHandler<ModifierDateMiseEnServiceUseCase> = async ({
    dateMiseEnServiceValue,
    référenceDossierValue,
    identifiantProjetValue,
    modifiéeLeValue,
    modifiéeParValue,
  }) => {
    const dateMiseEnService = DateTime.convertirEnValueType(dateMiseEnServiceValue);
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const référenceDossier =
      RéférenceDossierRaccordement.convertirEnValueType(référenceDossierValue);
    const modifiéeLe = DateTime.convertirEnValueType(modifiéeLeValue);
    const modifiéePar = Email.convertirEnValueType(modifiéeParValue);

    await mediator.send<ModifierDateMiseEnServiceCommand>({
      type: 'Lauréat.Raccordement.Command.ModifierDateMiseEnService',
      data: {
        dateMiseEnService,
        identifiantProjet,
        référenceDossier,
        modifiéeLe,
        modifiéePar,
      },
    });
  };

  mediator.register('Lauréat.Raccordement.UseCase.ModifierDateMiseEnService', runner);
};
