import { mediator, MessageHandler, Message } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';

import { SupprimerDossierDuRaccordementCommand } from './supprimerDossierDuRaccordement.command';

export type SupprimerDossierDuRaccordementUseCase = Message<
  'Réseau.Raccordement.UseCase.SupprimerDossierDuRaccordement',
  {
    identifiantProjetValue: string;
    référenceDossierValue: string;
    rôleValue: string;
  }
>;

export const registerSupprimerDossierDuRaccordementUseCase = () => {
  const runner: MessageHandler<SupprimerDossierDuRaccordementUseCase> = async ({
    identifiantProjetValue,
    référenceDossierValue,
    rôleValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const référenceDossier =
      RéférenceDossierRaccordement.convertirEnValueType(référenceDossierValue);
    const rôle = Role.convertirEnValueType(rôleValue);

    await mediator.send<SupprimerDossierDuRaccordementCommand>({
      type: 'Réseau.Raccordement.Command.SupprimerDossierDuRaccordement',
      data: {
        identifiantProjet,
        référenceDossier,
        rôle,
      },
    });
  };

  mediator.register('Réseau.Raccordement.UseCase.SupprimerDossierDuRaccordement', runner);
};
