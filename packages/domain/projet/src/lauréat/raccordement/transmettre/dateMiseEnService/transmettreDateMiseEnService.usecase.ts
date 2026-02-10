import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';
import { IdentifiantProjet } from '../../../../index.js';

import { TransmettreDateMiseEnServiceCommand } from './transmettreDateMiseEnService.command.js';

export type TransmettreDateMiseEnServiceUseCase = Message<
  'Lauréat.Raccordement.UseCase.TransmettreDateMiseEnService',
  {
    dateMiseEnServiceValue: string;
    référenceDossierValue: string;
    identifiantProjetValue: string;
    transmiseLeValue: string;
    transmiseParValue: string;
  }
>;

export const registerTransmettreDateMiseEnServiceUseCase = () => {
  const runner: MessageHandler<TransmettreDateMiseEnServiceUseCase> = async ({
    dateMiseEnServiceValue,
    référenceDossierValue,
    identifiantProjetValue,
    transmiseLeValue,
    transmiseParValue,
  }) => {
    const dateMiseEnService = DateTime.convertirEnValueType(dateMiseEnServiceValue);
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const référenceDossier =
      RéférenceDossierRaccordement.convertirEnValueType(référenceDossierValue);
    const transmiseLe = DateTime.convertirEnValueType(transmiseLeValue);
    const transmisePar = Email.convertirEnValueType(transmiseParValue);

    await mediator.send<TransmettreDateMiseEnServiceCommand>({
      type: 'Lauréat.Raccordement.Command.TransmettreDateMiseEnService',
      data: {
        dateMiseEnService,
        identifiantProjet,
        référenceDossier,
        transmiseLe,
        transmisePar,
      },
    });
  };

  mediator.register('Lauréat.Raccordement.UseCase.TransmettreDateMiseEnService', runner);
};
