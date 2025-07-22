import { mediator, MessageHandler, Message } from 'mediateur';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';
import { IdentifiantProjet } from '../../../..';

import { SupprimerDossierDuRaccordementCommand } from './supprimerDossierDuRaccordement.command';

export type SupprimerDossierDuRaccordementUseCase = Message<
  'Lauréat.Raccordement.UseCase.SupprimerDossierDuRaccordement',
  {
    identifiantProjetValue: string;
    référenceDossierValue: string;
  }
>;

export const registerSupprimerDossierDuRaccordementUseCase = () => {
  const runner: MessageHandler<SupprimerDossierDuRaccordementUseCase> = async ({
    identifiantProjetValue,
    référenceDossierValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const référenceDossier =
      RéférenceDossierRaccordement.convertirEnValueType(référenceDossierValue);

    await mediator.send<SupprimerDossierDuRaccordementCommand>({
      type: 'Lauréat.Raccordement.Command.SupprimerDossierDuRaccordement',
      data: {
        identifiantProjet,
        référenceDossier,
      },
    });
  };

  mediator.register('Lauréat.Raccordement.UseCase.SupprimerDossierDuRaccordement', runner);
};
