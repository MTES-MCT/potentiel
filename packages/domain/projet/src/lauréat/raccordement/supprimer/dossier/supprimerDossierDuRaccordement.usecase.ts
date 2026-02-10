import { mediator, MessageHandler, Message } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';
import { IdentifiantProjet } from '../../../../index.js';

import { SupprimerDossierDuRaccordementCommand } from './supprimerDossierDuRaccordement.command.js';

export type SupprimerDossierDuRaccordementUseCase = Message<
  'Lauréat.Raccordement.UseCase.SupprimerDossierDuRaccordement',
  {
    identifiantProjetValue: string;
    référenceDossierValue: string;
    suppriméLeValue: string;
    suppriméParValue: string;
    rôleValue: string;
  }
>;

export const registerSupprimerDossierDuRaccordementUseCase = () => {
  const runner: MessageHandler<SupprimerDossierDuRaccordementUseCase> = async ({
    identifiantProjetValue,
    référenceDossierValue,
    suppriméLeValue,
    suppriméParValue,
    rôleValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const référenceDossier =
      RéférenceDossierRaccordement.convertirEnValueType(référenceDossierValue);
    const suppriméLe = DateTime.convertirEnValueType(suppriméLeValue);
    const suppriméPar = Email.convertirEnValueType(suppriméParValue);
    const rôle = Role.convertirEnValueType(rôleValue);

    await mediator.send<SupprimerDossierDuRaccordementCommand>({
      type: 'Lauréat.Raccordement.Command.SupprimerDossierDuRaccordement',
      data: {
        identifiantProjet,
        référenceDossier,
        suppriméLe,
        suppriméPar,
        rôle,
      },
    });
  };

  mediator.register('Lauréat.Raccordement.UseCase.SupprimerDossierDuRaccordement', runner);
};
