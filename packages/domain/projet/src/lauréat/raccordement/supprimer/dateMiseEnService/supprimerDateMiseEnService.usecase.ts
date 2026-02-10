import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';
import { IdentifiantProjet } from '../../../../index.js';

import { SupprimerDateMiseEnServiceCommand } from './supprimerDateMiseEnService.command.js';

export type SupprimerDateMiseEnServiceUseCase = Message<
  'Lauréat.Raccordement.UseCase.SupprimerDateMiseEnService',
  {
    référenceDossierValue: string;
    identifiantProjetValue: string;
    suppriméeLeValue: string;
    suppriméeParValue: string;
  }
>;

export const registerSupprimerDateMiseEnServiceUseCase = () => {
  const runner: MessageHandler<SupprimerDateMiseEnServiceUseCase> = async ({
    référenceDossierValue,
    identifiantProjetValue,
    suppriméeLeValue,
    suppriméeParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const référenceDossier =
      RéférenceDossierRaccordement.convertirEnValueType(référenceDossierValue);
    const suppriméeLe = DateTime.convertirEnValueType(suppriméeLeValue);
    const suppriméePar = Email.convertirEnValueType(suppriméeParValue);

    await mediator.send<SupprimerDateMiseEnServiceCommand>({
      type: 'Lauréat.Raccordement.Command.SupprimerDateMiseEnService',
      data: {
        identifiantProjet,
        référenceDossier,
        suppriméeLe,
        suppriméePar,
      },
    });
  };

  mediator.register('Lauréat.Raccordement.UseCase.SupprimerDateMiseEnService', runner);
};
