import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';

import { ModifierDateMiseEnServiceCommand } from './modifierDateMiseEnService.command';

export type ModifierDateMiseEnServiceUseCase = Message<
  'Réseau.Raccordement.UseCase.ModifierDateMiseEnService',
  {
    dateMiseEnServiceValue: string;
    référenceDossierValue: string;
    identifiantProjetValue: string;
  }
>;

export const registerModifierDateMiseEnServiceUseCase = () => {
  const runner: MessageHandler<ModifierDateMiseEnServiceUseCase> = async ({
    dateMiseEnServiceValue,
    référenceDossierValue,
    identifiantProjetValue,
  }) => {
    const dateMiseEnService = DateTime.convertirEnValueType(dateMiseEnServiceValue);
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const référenceDossier =
      RéférenceDossierRaccordement.convertirEnValueType(référenceDossierValue);

    await mediator.send<ModifierDateMiseEnServiceCommand>({
      type: 'Réseau.Raccordement.Command.ModifierDateMiseEnService',
      data: {
        dateMiseEnService,
        identifiantProjet,
        référenceDossier,
      },
    });
  };

  mediator.register('Réseau.Raccordement.UseCase.ModifierDateMiseEnService', runner);
};
