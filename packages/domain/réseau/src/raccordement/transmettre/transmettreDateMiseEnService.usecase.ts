import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';

import { TransmettreDateMiseEnServiceCommand } from './transmettreDateMiseEnService.command';

export type TransmettreDateMiseEnServiceUseCase = Message<
  'Réseau.Raccordement.UseCase.TransmettreDateMiseEnService',
  {
    dateMiseEnServiceValue: string;
    référenceDossierValue: string;
    identifiantProjetValue: string;
  }
>;

export const registerTransmettreDateMiseEnServiceUseCase = () => {
  const runner: MessageHandler<TransmettreDateMiseEnServiceUseCase> = async ({
    dateMiseEnServiceValue,
    référenceDossierValue,
    identifiantProjetValue,
  }) => {
    const dateMiseEnService = DateTime.convertirEnValueType(dateMiseEnServiceValue);
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const référenceDossier =
      RéférenceDossierRaccordement.convertirEnValueType(référenceDossierValue);

    await mediator.send<TransmettreDateMiseEnServiceCommand>({
      type: 'Réseau.Raccordement.Command.TransmettreDateMiseEnService',
      data: {
        dateMiseEnService,
        identifiantProjet,
        référenceDossier,
      },
    });
  };

  mediator.register('Réseau.Raccordement.UseCase.TransmettreDateMiseEnService', runner);
};
