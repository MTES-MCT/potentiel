import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { IdentifiantProjet } from '../../../../index.js';
import { TypeDocumentsRaccordement } from '../../index.js';
import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';
import type { SupprimerDocumentCommand } from './supprimerDocumentRaccordement.command.js';

export type SupprimerDocumentUseCase = Message<
  'Lauréat.Raccordement.UseCase.SupprimerDocument',
  {
    identifiantProjetValue: string;
    référenceDossierRaccordementValue: string;
    typeValue: string;
    suppriméLeValue: string;
    suppriméParValue: string;
    rôleValue: string;
  }
>;

export const registerSupprimerDocumentUseCase = () => {
  const runner: MessageHandler<SupprimerDocumentUseCase> = async ({
    identifiantProjetValue,
    référenceDossierRaccordementValue,
    typeValue,
    suppriméLeValue,
    suppriméParValue,
    rôleValue,
  }) => {
    const typeDocument = TypeDocumentsRaccordement.convertirEnValueType(typeValue);

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const référenceDossierRaccordement = RéférenceDossierRaccordement.convertirEnValueType(
      référenceDossierRaccordementValue,
    );

    await mediator.send<SupprimerDocumentCommand>({
      type: 'Lauréat.Raccordement.Command.SupprimerDocument',
      data: {
        identifiantProjet,
        référenceDossierRaccordement,
        suppriméLe: DateTime.convertirEnValueType(suppriméLeValue),
        suppriméPar: Email.convertirEnValueType(suppriméParValue),
        type: typeDocument,
        rôle: Role.convertirEnValueType(rôleValue),
      },
    });
  };

  mediator.register('Lauréat.Raccordement.UseCase.SupprimerDocument', runner);
};
