import { mediator, MessageHandler, Message } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';
import { IdentifiantProjet } from '../../../..';

import { SupprimerDossierDuRaccordementCommand } from './supprimerDossierDuRaccordement.command';

export type SupprimerDossierDuRaccordementUseCase = Message<
  'Lauréat.Raccordement.UseCase.SupprimerDossierDuRaccordement',
  {
    identifiantProjetValue: string;
    référenceDossierValue: string;
    suppriméLeValue: string;
    suppriméParValue: string;
  }
>;

export const registerSupprimerDossierDuRaccordementUseCase = () => {
  const runner: MessageHandler<SupprimerDossierDuRaccordementUseCase> = async ({
    identifiantProjetValue,
    référenceDossierValue,
    suppriméLeValue,
    suppriméParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const référenceDossier =
      RéférenceDossierRaccordement.convertirEnValueType(référenceDossierValue);
    const suppriméLe = DateTime.convertirEnValueType(suppriméLeValue);
    const suppriméPar = Email.convertirEnValueType(suppriméParValue);

    await mediator.send<SupprimerDossierDuRaccordementCommand>({
      type: 'Lauréat.Raccordement.Command.SupprimerDossierDuRaccordement',
      data: {
        identifiantProjet,
        référenceDossier,
        suppriméLe,
        suppriméPar,
      },
    });
  };

  mediator.register('Lauréat.Raccordement.UseCase.SupprimerDossierDuRaccordement', runner);
};
